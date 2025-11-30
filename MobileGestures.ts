import { Component, CodeBlockEvents, Player, EventSubscription, PropTypes, RaycastHit, RaycastGizmo, LayerType, RaycastTargetType } from 'horizon/core';
import { Gestures, TouchState } from 'horizon/mobile_gestures';

class MobileGestures extends Component<typeof MobileGestures> {
    static propsDefinition = {
        rayCast: { type: PropTypes.Entity, },
};

    private activePlayer: Player | undefined;

    private onTap: EventSubscription | undefined;
    private gestures = new Gestures(this);

    preStart() {
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player: Player) => this.OnPlayerEnterWorld(player));
    }

    start() {
        this.activePlayer = this.entity.owner.get();

        if (this.activePlayer !== this.world.getServerPlayer()) {
            this.activePlayer.enterFocusedInteractionMode();

            this.onTap = this.gestures.onTap.connectLocalEvent(({ touches }) => this.PlayerTap(touches));
        }
    }

    PlayerTap(touches: TouchState[]) {
        console.log("Player Tap Detected: " + touches.length + " touches");
        if (touches[0].phase === 'end') {
            if (this.props.rayCast) {
                const hit: RaycastHit | null = this.props.rayCast.as(RaycastGizmo).raycast(touches[0].current.worldRayOrigin, touches[0].current.worldRayDirection, {
                    layerType: LayerType.Objects,
                    maxDistance: 100,
                });

                if (hit) {
                    console.log("Hit");
                    if (hit.targetType === RaycastTargetType.Entity) {
                        console.log("Hit Entity");
                    }
                }
            }
            else {
                console.warn("rayCast is missing");
                return;
            }
        }
    }

    OnPlayerEnterWorld(player: Player) {
        this.entity.owner.set(player);
    }

    Sleep(delayMS: number) {
        return new Promise((resolve) => this.async.setTimeout(resolve, delayMS));
    }
}
Component.register(MobileGestures);