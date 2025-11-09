import { Component, PropTypes, Player, PlayerControls, InteractionInfo, Vec3, EventSubscription, RaycastGizmo, World, Quaternion, clamp } from 'horizon/core';
import LocalCamera from 'horizon/camera';

class TapToMove extends Component<typeof TapToMove> {
    static propsDefinition = {
        raycastGizmo: { type: PropTypes.Entity },
        isTopDown: { type: PropTypes.Boolean, default: true },
        topDownCameraDistance: { type: PropTypes.Number, default: 10 },
        topDownCameraPitch: { type: PropTypes.Number, default: 90 },
        moveSpeed: { type: PropTypes.Number, default: 4.5 },
        lerpSpeed: { type: PropTypes.Number, default: 5 },
        slerpSpeed: { type: PropTypes.Number, default: 5 },
        thirdPersonCameraHeight: { type: PropTypes.Number, default: 2 },
        thirdPersonCameraLookHeight: { type: PropTypes.Number, default: 1.5 },
        thirdPersonCameraDistance: { type: PropTypes.Number, default: 5 },
        cameraSwitchDelayMS: { type: PropTypes.Number, default: 100 },
    };

    private activePlayer: Player | undefined;

    private onFocusedInteractionInputMovedEvent: EventSubscription | undefined;
    private onPrePhysicsUpdateEvent: EventSubscription | undefined;

    start() {
        this.activePlayer = this.entity.owner.get();

        if (this.activePlayer !== this.world.getServerPlayer()) {
            this.activePlayer.enterFocusedInteractionMode({ disableFocusExitButton: true });
            this.onFocusedInteractionInputMovedEvent = this.connectLocalBroadcastEvent(PlayerControls.onFocusedInteractionInputMoved, (data) => this.movePlayerToPosition(data.interactionInfo));

            this.async.setTimeout(() => {
                if (this.props.isTopDown) LocalCamera.setCameraModeAttach(this.activePlayer!, { positionOffset: new Vec3(0, this.props.topDownCameraDistance, 0), rotationOffset: new Vec3(this.props.topDownCameraPitch, 0, 0) });
                else {
                    LocalCamera.setCameraModeAttach(this.entity);
                    this.onPrePhysicsUpdateEvent = this.connectLocalBroadcastEvent(World.onPrePhysicsUpdate, data => this.update(data.deltaTime));
                }
            }, this.props.cameraSwitchDelayMS);
        }
        else this.cleanup();
    }

    update(deltaTime: number) {
        if (!this.activePlayer) return;
        if (!this.activePlayer.isNavigating) return;

        const playerPos = this.activePlayer.position.get();
        const playerRot = this.activePlayer.rootRotation.get();
        const x = playerRot.x;
        const y = playerRot.y;
        const z = playerRot.z;
        const w = playerRot.w;

        let playerForward: Vec3 = Vec3.zero;
        playerForward.x = 2 * (w * y + x * z);
        playerForward.y = 2 * (y * z - w * z);
        playerForward.z = 1 - 2 * (x * x + y * y);
        playerForward = playerForward.normalize();

        const behindHorizontal = new Vec3(-playerForward.x * this.props.thirdPersonCameraDistance, 0, -playerForward.z * this.props.thirdPersonCameraDistance);
        const camerPos = playerPos.add(behindHorizontal).add(new Vec3(0, this.props.thirdPersonCameraHeight, 0));

        const currentPos = this.entity.position.get();
        const t = clamp(deltaTime * this.props.lerpSpeed, 0, 1);
        const newPosX = currentPos.x + (camerPos.x - currentPos.x) * t;
        const newPosY = currentPos.y + (camerPos.y - currentPos.y) * t;
        const newPosZ = currentPos.z + (camerPos.z - currentPos.z) * t;
        const smoothPos = new Vec3(newPosX, newPosY, newPosZ);
        this.entity.position.set(smoothPos);

        const lookDirection = (playerPos.add(new Vec3(0, this.props.thirdPersonCameraLookHeight, 0))).sub(this.entity.position.get());
        const targetRotation = Quaternion.lookRotation(lookDirection, Vec3.up);
        this.entity.rotation.set(Quaternion.slerp(this.entity.rotation.get(), targetRotation, deltaTime * this.props.slerpSpeed));
    }

    cleanup() {
        if (this.onFocusedInteractionInputMovedEvent) {
            this.onFocusedInteractionInputMovedEvent.disconnect();
            this.onFocusedInteractionInputMovedEvent = undefined;
        }
        if (this.onPrePhysicsUpdateEvent) {
            this.onPrePhysicsUpdateEvent.disconnect();
            this.onPrePhysicsUpdateEvent = undefined;
        }
    }

    movePlayerToPosition(interactionInfo: InteractionInfo[]) {
        if (!this.activePlayer) return;
        if (interactionInfo.length === 0) return;

        const firstInteraction = interactionInfo[0];

        if (firstInteraction.interactionIndex !== 0) return;

        if (!this.props.raycastGizmo) {
            console.warn("raycastGizmo is missing or null.")
            return;
        }

        const hit = this.props.raycastGizmo.as(RaycastGizmo).raycast(firstInteraction.worldRayOrigin, firstInteraction.worldRayDirection);

        if (!hit) return;

        this.activePlayer.moveToPosition(hit.hitPoint, { movementSpeed: this.props.moveSpeed });
    }
}
Component.register(TapToMove);