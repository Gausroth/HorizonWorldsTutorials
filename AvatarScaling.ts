import { CodeBlockEvents, Component, Player, PropTypes, SpawnPointGizmo } from 'horizon/core';

class AvatarScaling extends Component<typeof AvatarScaling> {
    static propsDefinition = {
        spawnPoint: { type: PropTypes.Entity, default: undefined}
    }

    // max scale is 50
    // min scale is .05

    private scaleSizes: number[] = [.5, 1, 5];

    preStart() {
        // connect to the OnPlayerEnterTrigger code block event
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, player => this.OnPlayerEnterTrigger(player));
    }

    start() { }

    OnPlayerEnterTrigger(player: Player) {
        // ensure that the spawnPoint variable has been set
        if (!this.props.spawnPoint) {
            console.warn("spawnPoint is null or missing on " + this.entity.name.get());
            return;
        }

        // get the current scale index
        const playerScale = player.avatarScale.get()
        let index = this.scaleSizes.indexOf(playerScale);

        // update the index
        index = (index + 1) % this.scaleSizes.length;

        // set the players scale and teleport player
        player.avatarScale.set(this.scaleSizes[index]);
        this.props.spawnPoint.as(SpawnPointGizmo).teleportPlayer(player);
    }
}
Component.register(AvatarScaling);