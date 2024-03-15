{{config(materialized = 'table' )}} 
/* this CTE rebuild the ticket message table as in the PSQL table based on the CDC events 
We keep the last event received for the ticket id based on __event_timestamp and we remove the delete ticket with __deleted is false */
with tickets as (
    Select * FROM (
        select *, row_number() over( partition by account_id, id order by __event_timestamp desc) as rn
        from `growth-ops-recruiting`.helpdesk_analytics.ticket_events
    )
    where rn = 1 and  __deleted is false
    order by 1
)
 

 -- this CTE rebuild the ticket message table as in the PSQL table based on the CDC events, same logic as above
, ticket_message as (
    select * from (
        select *, row_number() over( partition by account_id, id order by __event_timestamp DESC) _rnumb
    from `growth-ops-recruiting`.helpdesk_analytics.ticket_message_events
    )
    where _rnumb = 1
       and  __deleted IS FALSE 

         )

select t.account_id, t.id, t.from_agent, t.created_datetime,
count(case when tm.from_agent is true then 1 else null end) > 0 as ticket_message_from_agent
from tickets t left join ticket_message tm on t.account_id = tm.account_id and t.id = tm.ticket_id
group by
    account_id, id,
    from_agent, created_datetime