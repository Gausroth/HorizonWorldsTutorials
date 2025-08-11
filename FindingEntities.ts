import { Component, Entity, EntityNameMatchOperation, EntityTagMatchOperation } from 'horizon/core';

//Documentation:
//https://developers.meta.com/horizon-worlds/reference/2.0.0/core_world
//https://developers.meta.com/horizon-worlds/reference/2.0.0/core_entitynamematchoperation
//https://developers.meta.com/horizon-worlds/reference/2.0.0/core_entitytagmatchoperation
class FindingEntities extends Component<typeof FindingEntities> {
    static propsDefinition = {};

    sphereA: Entity | undefined;
    spheres: Entity[] = [];
    sphereBs: Entity[] = [];


    start() {
        // returns an entity with a matching name. Will error if more than one is found.
        this.sphereA = this.world.findEntity("SphereA");

        // retuns all entities where its name matches the name string and match operation.
        this.spheres = this.world.findEntities("Sphere", { rootEntity: undefined, matchOperation: EntityNameMatchOperation.Exact });

        // retuns all entities where its tag(s) match the tag name string array and math operation.
        this.sphereBs = this.world.getEntitiesWithTags(["Sphere"], EntityTagMatchOperation.HasAnyExact)

        if (this.sphereA) console.log(this.sphereA.name.get())
        console.log(this.spheres.length);
        console.log(this.sphereBs.length);
    }

}
Component.register(FindingEntities);