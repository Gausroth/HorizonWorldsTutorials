import { Component, CodeBlockEvents, Player, CodeBlockEvent, PropTypes, NetworkEvent } from 'horizon/core';

/*
YouTube Tutorial:
https://youtu.be/2bH_ypYp3R0

GitHub:
https://github.com/Gausroth/HorizonWorldsTutorials

Documentaion:
https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/world-leaderboard-gizmo
https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/quests-leaderboards-and-variable-groups/leaderboard-reset-frequency
https://developers.meta.com/horizon-worlds/reference/2.0.0/core_ileaderboards
https://developers.meta.com/horizon-worlds/learn/documentation/mhcp-program/community-tutorials/creator-manual#leaderboards
*/

class TSLeaderboards extends Component<typeof TSLeaderboards> {
    static propsDefinition = {};

    preStart() {
        // coming from a Code Block script comment out or DELETE if using TypeScript
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[leaderboardName: string, p: Player, score: number, override: boolean]>('SetLeaderboard', [PropTypes.String, PropTypes.Player, PropTypes.Number, PropTypes.Boolean]), (leaderboardName: string, p: Player, score: number, override: boolean) => this.setLeaderboard(leaderboardName, p, score, override));

        // coming from a TypeScript comment out or DELETE if using Code Blocks
        this.connectNetworkEvent(this.entity, new NetworkEvent<{ leaderboardName: string, p: Player, score: number, override: boolean }>('SetLeaderboard'), ({ leaderboardName, p, score, override }) => this.setLeaderboard(leaderboardName, p, score, override));
    }

    start() { }

    setLeaderboard(leaderboardName: string, p: Player, score: number, override: boolean) {
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, override);
    }
}
Component.register(TSLeaderboards);