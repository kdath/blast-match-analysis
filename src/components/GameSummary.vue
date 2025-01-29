<template>
  <main>
    <div class="header">
      <div class="title">Game summary</div>
      <div class="subtitle">{{ map }} - {{ date }}</div>
    </div>
    <div class="teamBox">
      <div class="something">
        <div class="profile">
          <img src="../assets/S1mple_830x1044-webp.webp" width="100%" class="grayPortrait" />
        </div>
        <div class="teamWrapper">
          <div class="teamName">
            {{ lastRoundCt }}
          </div>
          <div class="score">
            {{ ctScore }}
          </div>
          <table class="playerWrapper">
            <tbody>
              <tr class="playerHeader">
                <td class="playerName">Player</td>
                <td class="playerDeaths">K</td>
                <td class="playerKills">D</td>
                <td class="playerKd">K/D</td>
                <td class="playerKd">Utility damage</td>
              </tr>
              <tr class="player" v-for="(player, index) in ctTeam" :key="index">
                <td>
                  {{ player.name }}
                </td>
                <td>
                  {{ player.kills }}
                </td>
                <td>
                  {{ player.deaths }}
                </td>
                <td>
                  {{ (player.kills / player.deaths).toFixed(1) }}
                </td>
                <td>
                  {{ player.grenadeDamage }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="something">
        <div class="teamWrapper">
          <div class="teamName">
            {{ lastRoundT }}
          </div>
          <div class="score">
            {{ tScore }}
          </div>
          <table class="playerWrapper">
            <tbody>
              <tr class="playerHeader">
                <td class="playerName">Player</td>
                <td class="playerDeaths">K</td>
                <td class="playerKills">D</td>
                <td class="playerKd">K/D</td>
                <td class="playerKd">Utility damage</td>
              </tr>
              <tr class="player" v-for="(player, index) in tTeam" :key="index">
                <td>
                  {{ player.name }}
                </td>
                <td>
                  {{ player.kills }}
                </td>
                <td>
                  {{ player.deaths }}
                </td>
                <td>
                  {{ (player.kills / player.deaths).toFixed(1) }}
                </td>
                <td>
                  {{ player.grenadeDamage }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="profile">
          <img src="../assets/zywoo_profile.png" width="100%" />
        </div>
      </div>
    </div>
    <div class="header">
      <div class="title">MVG</div>
      <div class="subtitle">Most Valuable Grenadier</div>
    </div>
    <div class="mvgWrapper">
      <div class="mvgName">{{ highestDamagingPlayer.name }}</div>
      <img class="imgWithBorder" src="../assets/apEX-cs2-player-profile-picture.webp" width="20%" />
      <div class="granadeDamage">{{ highestDamagingPlayer.grenadeDamage }}</div>
    </div>
  </main>
</template>

<script lang="ts">
import { parseMatchData } from '../utility/gameFileParser'
import type { ParsedStatistics, PlayerData } from '../utility/gameFileParser'
const matchData: ParsedStatistics = parseMatchData()
const map = matchData.match.map
const date = matchData.match.date
const lastRoundCt = matchData.match.rounds[matchData.match.numberOfRounds - 1].CT
const lastRoundT = matchData.match.rounds[matchData.match.numberOfRounds - 1].T
const ctScore = matchData.match.rounds[matchData.match.numberOfRounds - 1].score
  .split('-')[0]
  .trim()
const tScore = matchData.match.rounds[matchData.match.numberOfRounds - 1].score.split('-')[1].trim()

const ctTeam = [] as PlayerData[]
const tTeam = [] as PlayerData[]

for (const key in matchData.players) {
  const player = matchData.players[key]
  if (player.team == 'TERRORIST') {
    ctTeam.push(player)
  } else {
    tTeam.push(player)
  }
}

const highestDamagingPlayer = Object.keys(matchData.players)
  .map((key) => matchData.players[key])
  .reduce(
    (player, acc) => {
      if (player.grenadeDamage > acc.grenadeDamage) {
        acc = player
      }
      return acc
    },
    { grenadeDamage: 0 } as PlayerData,
  )

export default {
  name: 'GameSummary',
  data() {
    return {
      map,
      date,
      lastRoundCt,
      lastRoundT,
      ctScore,
      tScore,
      ctTeam,
      tTeam,
      highestDamagingPlayer,
    }
  },
}
</script>

<style>
main {
  width: 100%;
}
.teamWrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 70%;
}

.profile {
  width: 300px;
}

.grayPortrait {
  filter: grayscale(1);
}

.something {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-items: end;
  align-items: center;
  margin: auto;
}

.teamName {
  width: 100%;
  text-align: center;
  letter-spacing: 8px;
  font-size: 36px;
  line-height: 26px;
  font-weight: 900;
  text-transform: uppercase;
  font-family: TT Norms pro;
  color: #fffe3e;
}

.scoreBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.score {
  text-align: center;
  letter-spacing: 8px;
  font-size: 24px;
  font-style: bold italic;
  line-height: 26px;
  font-weight: 900;
  text-transform: uppercase;
  font-family: Radion;
  color: white;
}

.teamBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
}

.player {
  text-align: center;
  letter-spacing: 2px;
  font-size: 12px;
  font-style: italic;
  font-weight: 200;
  font-family: TT Norms pro;
  color: white;
}

.player td:first-child {
  text-align: left;
}

.playerWrapper {
  text-align: center;
  letter-spacing: 2px;
  font-size: 8px;
  font-style: normal;
  font-weight: 900;
  font-family: TT Norms pro;
  color: #fffe3e;
  width: 80%;
}

.playerWrapper td:first-child {
  text-align: left;
}

.playerWrapper td {
  padding: 3px;
}

.mvgWrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
}
.mvgName {
  width: 100%;
  text-wrap: nowrap;
  text-align: center;
  letter-spacing: 8px;
  font-size: 20px;
  line-height: 26px;
  font-weight: 900;
  font-family: TT Norms pro;
  color: #fffe3e;
}
.imgWithBorder {
  border: 1px solid #f9731c;
  margin: 0 auto;
  border-radius: 2%;
}
</style>
