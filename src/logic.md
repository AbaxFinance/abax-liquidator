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
        - workers that periodically insert new data into the tables
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
      listen on anchorPrice change (polling)
      get all user related datas
      recalculate HF
      via rust worker(?)
      update db (hf & updateAtLatest)
   1. Q:

   - threshold? - prices table? - every N seconds (5?):
     fetch all prices
     update prices table - insert currentPrice - if abs(currentPrice - anchorPrice) > getThreshold() - anchorPrice <-- currentPrice - insert updateTimestamp

(POTENTIAL_ACTOR)

1. periodic
   1. pseudocode:
      every N seconds (5?):
      get all user datas required for updating (select from tracking table where updateAtLatest <= now() )
      recalculate HF
      via rust worker(?)
      update db (hf & updateAtLatest)

## Liquidation

(POTENTIAL_ACTOR)

1. periodic
   1. pseudocode:
      every N seconds(5?):
      get all user datas below HF threshold (select from tracking table where HF <= hf_threshold )
      get market rules
      get current tokens prices
      calculateMinimumTokenReceivedE18 (weak point?)
      liquidate if profitable

##Notes
in case of a need for a queue
rabbitmq
https://www.reddit.com/r/node/comments/139w29v/how_do_you_handle_queues_in_nodejs_have_you_ever/
https://github.com/timgit/pg-boss
https://github.com/andywer/pg-listen

Centralized logger??
