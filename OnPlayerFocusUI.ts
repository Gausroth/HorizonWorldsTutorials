import { Component, CodeBlockEvents, Player, Entity } from 'horizon/core';

class OnPlayerFocusUI extends Component<typeof OnPlayerFocusUI> {
    static propsDefinition = {};

    preStart() {
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerFocusUI, (player: Player, focusedOn: Entity) => this.OnPlayerFocusUI(player, focusedOn))
    }

    start() { }

    OnPlayerFocusUI(player: Player, focusedOn: Entity) {
        console.log("Player focused on " + focusedOn.name.get());
    }
}
Component.register(OnPlayerFocusUI);