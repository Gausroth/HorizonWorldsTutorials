import { Component, PropTypes, Vec3, World } from 'horizon/core';

class MovingPlatform extends Component<typeof MovingPlatform> {
    static propsDefinition = {
        isLeftRight: { type: PropTypes.Boolean, default: false },
        isUpDown: { type: PropTypes.Boolean, default: false },
        moveAmount: { type: PropTypes.Number, default: 5 }
    };

    private positions: Vec3[] = [];
    private startPosition: Vec3 = new Vec3(0, 0, 0);
    private targetPosition: Vec3 = new Vec3(0, 0, 0);

    private elapsedTime: number = 0;
    private duration: number = 3;
    private positionsIndex: number = 1;

    private canMove: boolean = false;

    preStart() {
        // since we are going to be moving the object we want it to be as smooth as possible
        // in order for this smooth movement we must use onUpdate
        // since the player will be riding on top of this platform we will us onPrePhysicsUpdate
        // we do so that the platform moves before the physics on the player is applies
        this.connectLocalBroadcastEvent(World.onPrePhysicsUpdate, data => this.update(data))
    }

    start() {
        // since this platform can be set to move left/right or up/down or left/right/up/down
        // we need to get the platforms starting position so we can determine the positions of left/right/up/down
        const pos = this.entity.position.get()
        const offset = this.props.moveAmount;

        // the initial position will always be the top left position so we can just add the stafrting position first
        this.positions.push(pos)

        // now we must determine what type of platform this is, a left/right or up/down or left/right/up/down
        // based on which type it is we will add positions with the proper offset
        if (this.props.isLeftRight && !this.props.isUpDown) this.positions.push(pos.add(new Vec3(0, 0, offset)));
        else if (!this.props.isLeftRight && this.props.isUpDown) this.positions.push(pos.add(new Vec3(0, -offset, 0)));
        else if (this.props.isLeftRight && this.props.isUpDown) {
            this.positions.push(pos.add(new Vec3(0, 0, offset)));
            this.positions.push(pos.add(new Vec3(0, -offset, offset)));
            this.positions.push(pos.add(new Vec3(0, -offset, 0)));
        }

        // next we must set some variables to get the platform moving
        this.startPosition = this.entity.position.get()
        this.targetPosition = this.positions[this.positionsIndex];
        this.elapsedTime = 0
        this.canMove = true;
    }

    update({ deltaTime }: { deltaTime: number }) {
        // when using update we must be carefull not to have things running if they do not need to be running
        // always wrap your code in some sort of logic
        // for example I may want to be able to stop the platform for some reason
        // wrapping it in a boolean allows me to stop the plaform and continue it at a later time.
        if (this.canMove) {

            console.log("Moving Platform Update")
            // here we are increasing the elasped time by delta time so that it increases at a normalized rate.
            // since this is a server script it will go off the server. If it was a local script it would go off the players headset.
            this.elapsedTime += deltaTime

            // if the elapse time has not yet reach the desired duration time we will continue to move the platform
            // we do this by using Vec3.lerp which returns a position between two vectors.
            // the position we want to return is the elapsed time divided by them desired duration
            // we then set the platforms current position to the returned vectore
            // and since the elasped time is increasing my delta time every frame our returned position will be closer to the target location every frame
            if (this.elapsedTime < this.duration) {
                const t = this.elapsedTime / this.duration
                const currentPosition = Vec3.lerp(this.startPosition, this.targetPosition, t)
                this.entity.position.set(currentPosition)
            }
            // once the elasped time is greater than or equal to the desired duration time
            // there is a few things that need to be done. First we must set the platforms position to the target position
            // we do this to make sure the platforms actually reaches the target location, else it could be off by a small amount
            // then we update all of the other variables
            else {
                this.entity.position.set(this.targetPosition)
                this.startPosition = this.entity.position.get()
                this.positionsIndex = (this.positionsIndex + 1) % this.positions.length
                this.targetPosition = this.positions[this.positionsIndex];
                this.elapsedTime = 0
            }
        }
    }
}
Component.register(MovingPlatform);