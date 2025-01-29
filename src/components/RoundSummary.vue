<template>
  <main>
    <div class="card">
      <div class="header">
        <div class="halftime">First half</div>
        <div class="teamRoundWrapper">
          <div class="team">CT : {{ firstHalfTeams['CT'] }}</div>
          <div class="team">T : {{ firstHalfTeams['TERRORIST'] }}</div>
        </div>
      </div>
      <table class="roundWrapper">
        <tbody>
          <tr class="roundHeader">
            <td>Round</td>
            <td>Duration</td>
            <td>Winner</td>
            <td>Score</td>
          </tr>
          <tr class="round" v-for="(round, index) in firstHalf" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>{{ round.duration }} s.</td>
            <td>
              {{ firstHalfTeams[round.winner] }}
            </td>
            <td>
              {{ round.score }}
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <div class="header">
                <div class="halftime">Second half</div>
                <div class="teamRoundWrapper">
                  <div class="team">CT : {{ firstHalfTeams['CT'] }}</div>
                  <div class="team">T : {{ firstHalfTeams['TERRORIST'] }}</div>
                </div>
              </div>
            </td>
          </tr>
          <tr class="roundHeader">
            <td>Round</td>
            <td>Duration</td>
            <td>Winner</td>
            <td>Score</td>
          </tr>
          <tr class="round" v-for="(round, index) in secondHalf" :key="index">
            <td>
              {{ index + 16 }}
            </td>
            <td>{{ round.duration }} s.</td>
            <td>
              {{ secondHalfTeams[round.winner] }}
            </td>
            <td>
              {{ round.score }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script lang="ts">
import { parseMatchData } from '../utility/gameFileParser'
import type { ParsedStatistics, RoundData } from '../utility/gameFileParser'
const matchData: ParsedStatistics = parseMatchData()

const firstHalf: RoundData[] = matchData.match.rounds.slice(0, 15)
const firstHalfTeams: Record<string, string> = {
  CT: firstHalf[0].sides['CT'],
  TERRORIST: firstHalf[0].sides['TERRORIST'],
}
const secondHalf: RoundData[] = matchData.match.rounds.slice(15, matchData.match.numberOfRounds)
const secondHalfTeams: Record<string, string> = {
  CT: secondHalf[0].sides['CT'],
  TERRORIST: secondHalf[0].sides['TERRORIST'],
}

export default {
  name: 'RoundSummary',
  data() {
    return {
      matchData,
      firstHalf,
      firstHalfTeams,
      secondHalf,
      secondHalfTeams,
    }
  },
}
</script>

<style>
.card {
  flex: auto;
  align-items: center;
  justify-items: center;
  padding-bottom: 80px;
  width: 60%;
  margin: 0 auto;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px auto;
  gap: 20px;
  letter-spacing: 2px;
}

.header .title {
  font-size: 24px;
  font-style: italic;
  line-height: 26px;
  font-weight: 900;
  text-transform: uppercase;
  font-family: Radion;
  color: white;
}

.teamRoundWrapper {
  display: flex;
  flex-direction: row;
  width: 80%;
  justify-content: space-between;
}

.team {
  font-size: 24px;
  font-style: italic;
  line-height: 12px;
  font-weight: 900;
  text-transform: uppercase;
  font-family: TT Norms pro;
  color: #fffe3e;
}

.tableWrapper {
  width: 100%;
  align-items: center;
}

.roundWrapper {
  text-align: left;
  letter-spacing: 2px;
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  font-family: TT Norms pro;
  color: #fffe3e;
  padding: auto;
}

.round {
  text-align: left;
  font-size: 16px;
  font-style: italic;
  font-weight: 900;
  font-family: TT Norms pro;
  color: white;
}

.round td {
  width: 10%;
}
.round td:first-child {
  width: 5%;
}
.round td:last-child {
  width: 1%;
}

.roundHeader {
  text-align: left;
  font-size: 24px;
  line-height: 26px;
  font-weight: 500;
  font-family: TT Norms pro;
  color: #fffe3e;
}

.round .score {
  font-family: TT Norms pro;
  text-align: start;
}

.halftime {
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  text-transform: uppercase;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-style: italic;
  line-height: 26px;
  font-weight: 900;
  color: #fffe3e;
  font-family: Radion;
  width: 100%;
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

.teamBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
}
</style>
