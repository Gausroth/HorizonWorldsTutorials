import { Component, CodeBlockEvents, Player, PropTypes } from 'horizon/core';
import { Npc } from 'horizon/npc';

class ConvoTest extends Component<typeof ConvoTest>{
    static propsDefinition = {
        trigger: { type: PropTypes.Entity, }
  };

    preStart() {
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player: Player) => this.OnPlayerEnterWorld(player));
        this.connectCodeBlockEvent(this.props.trigger!, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => this.OnPlayerEnterTrigger(player));
        this.connectCodeBlockEvent(this.props.trigger!, CodeBlockEvents.OnPlayerExitTrigger, (player: Player) => this.OnPlayerExitTrigger(player));
    }

  start() { }

    OnPlayerEnterWorld(player: Player) {
        if (player.name.get() === "Helper") return;
        const npc = this.entity.as(Npc);

        if(npc) npc.conversation.elicitResponse('Give a short introduce yourself to ' + player.name.get())
    }

    OnPlayerEnterTrigger(player: Player) {
        console.log("OnPlayerEnterTrigger")
        const npc = this.entity.as(Npc);
        console.log("isConversationEnabled: " + npc.isConversationEnabled())
        npc.conversation.stopSpeaking()

        if (npc) npc.conversation.registerParticipant(player);
    }

    OnPlayerExitTrigger(player: Player) {
        const npc = this.entity.as(Npc);

        if (npc) npc.conversation.unregisterParticipant(player);
    }
}
Component.register(ConvoTest);