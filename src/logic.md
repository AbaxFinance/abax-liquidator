HF priorities:

```
(0.00, 1.05]    0 critical 5   min interval
(1.05, 1.20]    1 high     10  min interval
(1.20, 1.50]    2 medium   15  min interval
(1.50, 2.00]    3 low      30  min interval
(2.00,  inf]    4 safe     120 min interval
```

## Event fetcher/listener

(POTENTIAL_ACTOR)

basically fetchEvents(?)

while true:
//assuming last successful block analyzed X
read Y blocks
push events into the db
mark last successfull block as X+Y

### possibilities:

    - independent event tables
        - insert event into appropriate table
    - denormalize events table
        - TODO performance?
    - secondary denormalized events table
        - worker that periodically insert new data into the table
        - advantage: flexible query

## HF recalculation

Note: updateAtLatest <-- intervalByHFPriority(some_hf) + now()

(POTENTIAL_ACTOR)

1. price changes

   1. pseudocode:
      via rust worker(?)
      listen on anchorPrice change (polling)
      get all reserve datas
      get all user related datas
      for each address:
      - recalculate HF
      - update db (hf & updateAtLatest)

(POTENTIAL_ACTOR)

1. periodic
   1. pseudocode:
      every N seconds (5?):
      get all reserve datas
      get all user datas required for updating (select from tracking table where updateAtLatest <= now() )
      for each address:
      - recalculate HF
      - via rust worker(?)
      - update db (hf & updateAtLatest)

## Liquidation

(POTENTIAL_ACTOR)

1. periodic
   1. pseudocode:
      get market rules
      listen on (event)address_to_liquidate
      get user data && current tokens prices from db
      calculateMinimumTokenReceivedE18 (weak point?)
      liquidate if profitable

##Notes
in case of a need for a queue
rabbitmq
https://www.reddit.com/r/node/comments/139w29v/how_do_you_handle_queues_in_nodejs_have_you_ever/
https://github.com/timgit/pg-boss
https://github.com/andywer/pg-listen

Centralized logger??
