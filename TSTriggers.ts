import { CodeBlockEvent, CodeBlockEvents, Component, Entity, Player, PropTypes, TriggerGizmo } from 'horizon/core';

// Meta Documentation: https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/use-the-trigger-zone
// Tutorial Video: https://youtu.be/055R1j4nzwM
// GitHub
class TSTriggers extends Component<typeof TSTriggers>{
    static propsDefinition = {};

    preStart() {
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (p: Player) => this.OnPlayerEnterTrigger(p));
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, (p: Player) => this.OnPlayerExitTrigger(p));


        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityEnterTrigger, (obj: Entity) => this.OnEntityEnterTrigger(obj));
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityExitTrigger, (obj: Entity) => this.OnEntityExitTrigger(obj));
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[obj: Entity]>('Occupied', [PropTypes.Entity]), (obj: Entity) => this.OnEntityTriggerOccupied(obj));
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[obj: Entity]>('Empty', [PropTypes.Entity]), (obj: Entity) => this.OnEntityTriggerEmptied(obj));
    }

    start() { }

    OnPlayerEnterTrigger(player: Player) {
        console.log(`Player ${player.name.get()} entered trigger.`);
    }

    OnPlayerExitTrigger(player: Player) {
        console.log(`Player ${player.name.get()} exited trigger.`);
    }

    OnEntityEnterTrigger(entity: Entity) {
        this.entity.as(TriggerGizmo).enabled.set(false);
        console.log(`Entity ${entity.name.get()} entered trigger`);
    }

    OnEntityExitTrigger(entity: Entity) {
        console.log(`Entity ${entity.name.get()} exited trigger`);
    }

    OnEntityTriggerOccupied(entity: Entity) {
        console.log(`Tigger Occupied`);
    }

    OnEntityTriggerEmptied(entity: Entity) {
        console.log(`Tigger Emptied`);
    }
}
Component.register(TSTriggers);