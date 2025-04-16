import { Component, CodeBlockEvent, CodeBlockEvents, Player, NetworkEvent, LocalEvent, Entity, PropTypes } from 'horizon/core';

class ConnectAndSend extends Component<typeof ConnectAndSend> {
    static propsDefinition = {};

    preStart() {
        // connecting to a built in CodeBlock Event
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => this.OnPlayerEnterTrigger(player));

        // connecting to a custom CodeBlock Event.
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[numberVar: number, entityVar: Entity]>('CodeBlockEvent', [PropTypes.Number, PropTypes.Entity]), (numberVar: number, entityVar: Entity) => this.CodeBlockEvent(numberVar, entityVar));

        // connecting to a Network Event. This can be used to recieve an event from any object that is sending a network event to this object.
        this.connectNetworkEvent(this.entity, new NetworkEvent<{ numberVar: number, entityVar: Entity }>('NetworkEvent'), ({ numberVar, entityVar }) => this.NetworkEvent(numberVar, entityVar));

        // connecting to a Network Event. This can be used to recieve an event from any object that is broadcast a network event.
        this.connectNetworkBroadcastEvent(new NetworkEvent<{ numberVar: number, entityVar: Entity }>('NetworkBroadcastEvent'), ({ numberVar, entityVar }) => this.NetworkBroadcastEvent(numberVar, entityVar));

        // connecting to a Local Event. This can be used to recieve an event from any object that is sending a local event to this object. NOTE: they must both be on the same client. Server to Server or Headset to Headset
        this.connectLocalEvent(this.entity, new LocalEvent<{ numberVar: number }>('LocalEvent'), ({ numberVar }) => this.LocalEvent(numberVar));

        // connecting to a Local Event. This can be used to recieve an event from any object that is broadcast a local event. NOTE: they must both be on the same client. Server to Server or Headset to Headset
        this.connectLocalBroadcastEvent(new LocalEvent<{ numberVar: number }>('LocalBroadcastEvent'), ({ numberVar }) => this.LocalBroadcastEvent(numberVar));

        
    }

    start() {
        this.SendingEvents(this.entity)
    }

    SendingEvents(entityVar: Entity) {
        // sending a Code Block Event
        this.sendCodeBlockEvent(entityVar, new CodeBlockEvent<[numberVar: number, entityVar: Entity]>('CodeBlockEvent', [PropTypes.Number, PropTypes.Entity]), 0, entityVar );

        // sending a Network Event. This can be sent to any object that is connecting to this event.
        this.sendNetworkEvent(entityVar, new NetworkEvent<{ numberVar: number, entityVar: Entity }>('NetworkEvent'), { numberVar: 0, entityVar: entityVar });

        // sending a Network Broadcast Event. This is not sent to any object but any object that is connecting to this event will recieve it.
        this.sendNetworkBroadcastEvent(new NetworkEvent<{ numberVar: number, entityVar: Entity }>('NetworkBroadcastEvent'), { numberVar: 0, entityVar: entityVar });

        // sending a Local Event. This can be sent to any object that is connecting to this event. NOTE: they must both be on the same client. Server to Server or Headset to Headset
        this.sendLocalEvent(entityVar, new NetworkEvent<{ numberVar: number, entityVar: Entity }>('LocalEvent'), { numberVar: 0, entityVar: entityVar });

        // sending a Local Broadcast Event. This is not sent to any object but any object that is connecting to this event will recieve it. NOTE: they must both be on the same client. Server to Server or Headset to Headset
        this.sendLocalBroadcastEvent(new NetworkEvent<{ numberVar: number, entityVar: Entity }>('LocalBroadcastEvent'), { numberVar: 0, entityVar: entityVar });
    }

    OnPlayerEnterTrigger(player: Player) {
        console.log("OnPlayerEnterTrigger")
    }

    NetworkEvent(numberVar: number, entityVar: Entity) {
        console.log("NetworkEvent")
    }

    NetworkBroadcastEvent(numberVar: number, entityVar: Entity) {
        console.log("NetworkBroadcastEvent")
    }

    LocalEvent(numberVar: number) {
        console.log("LocalEvent")
    }

    LocalBroadcastEvent(numberVar: number) {
        console.log("LocalBroadcastEvent")
    }

    CodeBlockEvent(numberVar: number, entityVar: Entity) {
        console.log("CodeBlockEvent")
    }
}
Component.register(ConnectAndSend);