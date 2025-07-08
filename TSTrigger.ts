import { CodeBlockEvent, CodeBlockEvents, Component, Entity, Player, PropTypes } from 'horizon/core';

// Documentation: https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/use-the-trigger-zone
// Tutorial Video:
// GitHub:

class TSTrigger extends Component<typeof TSTrigger>{
    static propsDefinition = {};

    preStart() {
        // player enter trigger events.
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (p: Player) => this.OnPlayerEnterTrigger(p));
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, (p: Player) => this.OnPlayerExitTrigger(p));
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[p: Player]>('Occupied', [PropTypes.Player]), (p: Player) => this.OnPlayerOccupiedTrigger(p));
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[p: Player]>('Empty', [PropTypes.Player]), (p: Player) => this.OnPlayerEmptyTrigger(p));

        // entity enter trigger events.
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityEnterTrigger, (e: Entity) => this.OnEntityEnterTrigger(e));
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityExitTrigger, (e: Entity) => this.OnEntityExitTrigger(e));
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[e: Entity]>('Occupied', [PropTypes.Entity]), (e: Entity) => this.OnEntityOccupiedTrigger(e));
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[e: Entity]>('Empty', [PropTypes.Entity]), (e: Entity) => this.OnEntityEmptyTrigger(e));
    }

    start() { }

    // runs when the player enters the trigger.
    OnPlayerEnterTrigger(player: Player) {
        console.log(player.name.get() + " entered");
    }

    // runs when the player exits the trigger.
    OnPlayerExitTrigger(player: Player) {
        console.log(player.name.get() + " exited");
    }

    // runs when the first player enters the trigger.
    OnPlayerOccupiedTrigger(p: Player) {
        console.log(p.name.get() + " occupied");
    }

    // runs when the last player exits the trigger.
    OnPlayerEmptyTrigger(p: Player) {
        console.log(p.name.get() + " emptied");
    }

    // runs when the tagged object enters the trigger.
    OnEntityEnterTrigger(entity: Entity) {
        console.log(entity.name.get() + " entered");
    }

    // runs when the tagged object exits the trigger.
    OnEntityExitTrigger(entity: Entity) {
        console.log(entity.name.get() + " exited");
    }

    // runs when the first tagged object enters the trigger.
    OnEntityOccupiedTrigger(e: Entity) {
        console.log(e.name.get() + " occupied");
    }

    // runs when the last tagged object exits the trigger.
    OnEntityEmptyTrigger(e: Entity) {
        console.log(e.name.get() + " emptied");
    }
}
Component.register(TSTrigger);