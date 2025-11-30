import { Component, PlayerInput, PropTypes, Player, World, PlayerControls, PlayerInputAction, ButtonIcon, CodeBlockEvents, Entity, Vec3, ProjectileLauncherGizmo } from 'horizon/core';

class PlayerInputTest extends Component<typeof PlayerInputTest> {
    static propsDefinition = {
        projetileLauncher: { type: PropTypes.Entity }
};

    private activePlayer: Player | null = null;

    private Jump: PlayerInput | null = null;
    private leftXAxis: PlayerInput | null = null;
    private leftYAxis: PlayerInput | null = null;
    private LeftGrip: PlayerInput | null = null;
    private LeftPrimary: PlayerInput | null = null;
    private LeftSecondary: PlayerInput | null = null;
    private LeftTertiary: PlayerInput | null = null;
    private LeftTrigger: PlayerInput | null = null;
    private RightXAxis: PlayerInput | null = null;
    private RightYAxis: PlayerInput | null = null;
    private RightGrip: PlayerInput | null = null;
    private RightPrimary: PlayerInput | null = null;
    private RightSecondary: PlayerInput | null = null;
    private RightTertiary: PlayerInput | null = null;
    private RightTrigger: PlayerInput | null = null;

    preStart() {
        this.connectLocalBroadcastEvent(World.onUpdate, this.onUpdate);
        this.connectCodeBlockEvent(this.props.projetileLauncher!, CodeBlockEvents.OnProjectileLaunched, (launcher: Entity) => this.OnProjectileLaunched(launcher));
        this.connectCodeBlockEvent(this.props.projetileLauncher!, CodeBlockEvents.OnProjectileHitEntity, (entityHit: Entity, position: Vec3, normal: Vec3, isStaticHit: boolean) => this.OnProjectileHitEntity(entityHit, position, normal, isStaticHit));

    }

    OnProjectileLaunched(launcher: Entity) {
        console.log("Projectile launched by: ", launcher.id);
    }

    OnProjectileHitEntity(entityHit: Entity, position: Vec3, normal: Vec3, isStaticHit: boolean) {
        console.log("Projectile hit entity: ", entityHit.id, " at position: ", position, " with normal: ", normal, " isStaticHit: ", isStaticHit);

    }

    start() {
        this.activePlayer = this.entity.owner.get();

        if (this.activePlayer !== this.world.getServerPlayer()) {

            if (PlayerControls.isInputActionSupported(PlayerInputAction.Jump)) {
                this.Jump = PlayerControls.connectLocalInput(
                    PlayerInputAction.Jump,
                    ButtonIcon.Jump,
                    this,
                    { customAssetIconId: "1367468824721056"}
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftXAxis)) {
                this.leftXAxis = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftXAxis,
                    ButtonIcon.None, // No icon for joystick axis
                    this
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftYAxis)) {
                this.leftYAxis = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftYAxis,
                    ButtonIcon.None, // No icon for joystick axis
                    this
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftGrip )) {
                this.LeftGrip = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftGrip,
                    ButtonIcon.Ability,
                    this,
                    { customAssetIconId: "24482881278080064" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftPrimary )) {
                this.LeftPrimary = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftPrimary,
                    ButtonIcon.Aim,
                    this,
                    { customAssetIconId: "1505634777245583" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftSecondary )) {
                this.LeftSecondary = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftSecondary,
                    ButtonIcon.Airstrike,
                    this,
                    { customAssetIconId: "1342301367553854" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftTertiary )) {
                this.LeftTertiary = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftTertiary,
                    ButtonIcon.InfiniteAmmo,
                    this,
                    { customAssetIconId: "1112685994368739" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.LeftTrigger)) {
                this.LeftTrigger = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftTrigger,
                    ButtonIcon.InfiniteAmmo,
                    this,
                    { customAssetIconId: "800427662946296" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightGrip)) {
                this.RightGrip = PlayerControls.connectLocalInput(
                    PlayerInputAction.RightGrip,
                    ButtonIcon.Inspect,
                    this,
                    { customAssetIconId: "708639658267387" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightTrigger )) {
                this.LeftTrigger = PlayerControls.connectLocalInput(
                    PlayerInputAction.LeftTrigger,
                    ButtonIcon.PttAvailable,
                    this,
                    { customAssetIconId: "676326902185567" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightXAxis)) {
                this.RightXAxis = PlayerControls.connectLocalInput(
                    PlayerInputAction.RightXAxis,
                    ButtonIcon.None, // No icon for joystick axis
                    this
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightYAxis)) {
                this.RightYAxis = PlayerControls.connectLocalInput(
                    PlayerInputAction.RightYAxis,
                    ButtonIcon.None, // No icon for joystick axis
                    this
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightPrimary)) {
                this.RightPrimary = PlayerControls.connectLocalInput(
                    PlayerInputAction.RightPrimary,
                    ButtonIcon.Drink,
                    this,
                    { customAssetIconId: "675324878557586" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightSecondary)) {
                this.RightSecondary = PlayerControls.connectLocalInput(
                    PlayerInputAction.RightSecondary,
                    ButtonIcon.Drop,
                    this,
                    { customAssetIconId: "594634780343123" }
                );
            }

            if (PlayerControls.isInputActionSupported(PlayerInputAction.RightTertiary)) {
                this.RightTertiary = PlayerControls.connectLocalInput(
                    PlayerInputAction.RightTertiary,
                    ButtonIcon.DualWield,
                    this,
                    { customAssetIconId: "834348062464384" }
                );
            }
        }
    }

    onUpdate = (data: { deltaTime: number }) => {
        // Getting the left joystick values only work in VR & Mobile
        if (!this.leftXAxis || !this.leftYAxis) return;
        if (this.leftXAxis.axisValue.get() !== 0 || this.leftYAxis.axisValue.get() !== 0)
            console.log(this.leftXAxis.axisValue.get(), this.leftYAxis.axisValue.get());

        //// Getting the right joystick values only work in VR
        //if (!this.RightXAxis || !this.RightYAxis) return;
        //if (this.RightXAxis.axisValue.get() !== 0 || this.RightYAxis.axisValue.get() !== 0)
        //    console.log(this.RightXAxis.axisValue.get(), this.RightYAxis.axisValue.get());

        // Getting the jump values work in VR, Mobile & Desktop
        if (!this.Jump) return;
        const jump = this.Jump.axisValue.get()
        if (jump !== 0) console.log("Jump:", jump);

        // Getting the LeftGrip values work in VR, Mobile & Desktop
        if (!this.LeftGrip) return;
        const LeftGrip = this.LeftGrip.axisValue.get()
        if (LeftGrip !== 0) console.log("LeftGrip:", LeftGrip);

        // Getting the LeftPrimary values work in VR, Mobile & Desktop
        if (!this.LeftPrimary) return;
        const LeftPrimary = this.LeftPrimary.axisValue.get()
        if (LeftPrimary !== 0) console.log("LeftPrimary:", LeftPrimary);

        // Getting the LeftSecondary values work in VR, Mobile & Desktop
        if (!this.LeftSecondary) return;
        const LeftSecondary = this.LeftSecondary.axisValue.get()
        if (LeftSecondary !== 0) console.log("LeftSecondary:", LeftSecondary);

        // Getting the LeftTertiary values work in VR, Mobile & Desktop
        if (!this.LeftTertiary) return;
        const LeftTertiary = this.LeftTertiary.axisValue.get()
        if (LeftTertiary !== 0) console.log("LeftTertiary:", LeftTertiary);

        // Getting the LeftTrigger values work in VR, Mobile & Desktop
        if (!this.LeftTrigger) return;
        const LeftTrigger = this.LeftTrigger.axisValue.get()
        if (LeftTrigger !== 0) console.log("LeftTrigger:", LeftTrigger);

        // Getting the RightGrip values work in VR, Mobile & Desktop
        if (!this.RightGrip) return;
        const RightGrip = this.RightGrip.axisValue.get()
        if (RightGrip !== 0) console.log("RightGrip:", RightGrip);

        // Getting the RightPrimary values work in VR, Mobile & Desktop
        if (!this.RightPrimary) return;
        const RightPrimary = this.RightPrimary.axisValue.get()
        if (RightPrimary !== 0) {
            this.props.projetileLauncher!.as(ProjectileLauncherGizmo).launch()
            console.log("RightPrimary:", RightPrimary);
        }

        // Getting the RightSecondary values work in VR, Mobile & Desktop
        if (!this.RightSecondary) return;
        const RightSecondary = this.RightSecondary.axisValue.get()
        if (RightSecondary !== 0) console.log("RightSecondary:", RightSecondary);

        // Getting the RightTertiary values work in VR, Mobile & Desktop
        if (!this.RightTertiary) return;
        const RightTertiary = this.RightTertiary.axisValue.get()
        if (RightTertiary !== 0) console.log("RightTertiary:", RightTertiary);

        // Getting the RightTrigger values work in VR, Mobile & Desktop
        if (!this.RightTrigger) return;
        const RightTrigger = this.RightTrigger.axisValue.get()
        if (RightTrigger !== 0) console.log("RightTrigger:", RightTrigger);
    }
}
Component.register(PlayerInputTest);