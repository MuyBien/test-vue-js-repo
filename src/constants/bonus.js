import { NoneBonus, BoostAllPlayersBonus, RemoveGoalBonus, BlockSubstitutionsBonus, BoostOnePlayerBonus, FourStrikersBonus, MirrorBonus, NerfGoalkeeperBonus, RemoveRandomPlayerBonus } from "@/models/bonus";

export const BONUSES = {
  none: NoneBonus,
  removeGoal: RemoveGoalBonus,
  blockTacticalSubs: BlockSubstitutionsBonus,
  removeRandomPlayer: RemoveRandomPlayerBonus,
  boostAllPlayers: BoostAllPlayersBonus,
  fourStrikers: FourStrikersBonus,
  nerfGoalkeeper: NerfGoalkeeperBonus,
  boostOnePlayer: BoostOnePlayerBonus,
  mirror: MirrorBonus,
};