cube(`BillableTicket`, {
  sql: `
        SELECT accountId,
            ticketCreatedDate,
            sum(isBillableTicket) AS totalBillableTicketPerDay,
            count(ticketId) AS totalTicketsPerDay
        FROM
            (SELECT accountId AS accountId,
                    ticketId,
                    (coalesce(SUM(ticketMessageFromAgent = true),0) + coalesce(SUM(ticketFromAgent = true),0) + coalesce(SUM(ticketBillableDatetime is not null),0)) > 0 as isBillableTicket,
                    argMaxIf(toDate(ticketCreatedDatetime), event__timestamp, event__origin = 'ticket') AS ticketCreatedDate
            FROM analytics_dataset
            WHERE event__origin in ('ticket-message',
                                    'ticket')
                AND ${FILTER_PARAMS.AutomationBillingEvent.accountId.filter(
                  "accountId"
                )}
                AND ${FILTER_PARAMS.AutomationBillingEvent.periodEnd.filter(
                  "event__timestamp"
                )}
                AND ${FILTER_PARAMS.AutomationBillingEvent.periodStart.filter(
                  "event__timestamp"
                )}
            GROUP BY accountId,
                    ticketId)
            GROUP BY accountId, ticketCreatedDate
    `,

  dimensions: {
    accountId: {
      sql: `${CUBE}.accountId`,
      type: `string`,
      primaryKey: true,
      shown: true,
    },
    ticketCreatedDate: {
      sql: `${CUBE}.ticketCreatedDate`,
      type: `time`,
    },
    totalTicketsPerDay: {
      sql: `${CUBE}.totalTicketsPerDay`,
      type: `number`,
    },
    totalBillableTicketPerDay: {
      sql: `${CUBE}.totalBillableTicketPerDay`,
      type: `number`,
    },
  },
  dataSource: `core`,
});

cube(`AutomateEvent`, {
  sql: `
    SELECT
        account_id as accountId,
        toDate(min_created_datetime) as createdDate,
        count(uuid) AS totalEvent,
        countIf(uuid, event_type = 'track_order') as automatedInteractionsByTrackOrder,
        countIf(
            uuid,
            event_type = 'loop_returns_started'
        ) as automatedInteractionsByLoopReturns,
        countIf(
            uuid,
            event_type = 'quick_response_started'
        ) as automatedInteractionsByQuickResponse,
        countIf(
            uuid,
            event_type = 'article_recommendation_started'
        ) as automatedInteractionsByArticleRecommendation,
        countIf(
            uuid,
            event_type = 'automated_response_started'
        ) as automatedInteractionsByAutomatedResponse,
        countIf(
            uuid,
            event_type IN ('flow_prompt_started', 'flow_ended_without_action')
        ) as automatedInteractionsByQuickResponseFlows,
        countIf(
            uuid,
            event_type = 'ticket_message_created_from_autoresponder'
        ) as automatedInteractionsByAutoResponders
    FROM
        (
            SELECT
                account_id,
                uuid,
                event_type,
                min(created_datetime) - INTERVAL 3 DAY AS min_created_datetime
            FROM
                automate_event
            WHERE
                ${FILTER_PARAMS.AutomateEvent.accountId.filter("account_id")}
            GROUP BY
                account_id,
                uuid,
                event_type
            HAVING
                ${FILTER_PARAMS.AutomateEvent.periodEnd.filter(
                  "min_created_datetime"
                )}
                AND ${FILTER_PARAMS.AutomateEvent.periodStart.filter(
                  "min_created_datetime"
                )}
        )
    GROUP BY
        accountId,
        createdDate
      `,
  segments: {},

  measures: {
    automationRate: {
      type: "number",
      sql: `(sum(${CUBE}.totalEvent) / (sum(${CUBE}.totalEvent) + (sum(${BillableTicket.totalBillableTicketPerDay}))))`,
    },
    automatedInteractions: {
      type: "number",
      sql: `sum(${CUBE}.totalEvent)`,
    },
    automatedInteractionsByTrackOrder: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByTrackOrder`,
    },
    automatedInteractionsByLoopReturns: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByLoopReturns`,
    },
    automatedInteractionsByQuickResponse: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByQuickResponse`,
    },
    automatedInteractionsByArticleRecommendation: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByArticleRecommendation`,
    },
    automatedInteractionsByAutomatedResponse: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByAutomatedResponse`,
    },
    automatedInteractionsByQuickResponseFlows: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByQuickResponseFlows`,
    },
    automatedInteractionsByAutoResponders: {
      type: "sum",
      sql: `${CUBE}.automatedInteractionsByAutoResponders`,
    },
  },
  dimensions: {
    accountId: {
      sql: `${CUBE}.accountId`,
      type: `string`,
      primaryKey: true,
      shown: true,
    },
    periodStart: {
      sql: `${CUBE}.createdDate`,
      type: `time`,
    },
    periodEnd: {
      sql: `${CUBE}.createdDate`,
      type: `time`,
    },
    createdDate: {
      sql: `${CUBE}.createdDate`,
      type: `time`,
    },
  },
  joins: {
    BillableTicket: {
      relationship: `one_to_one`,
      sql: `
                ${CUBE}.accountId = ${BillableTicket.accountId}
                AND ${CUBE}.createdDate = ${BillableTicket.ticketCreatedDate}
              `,
    },
  },
  dataSource: `core`,
});
