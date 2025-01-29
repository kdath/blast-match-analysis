import nuke from '../assets/NAVIvsVitaGF-Nuke.txt?raw'

export type ParsedStatistics = {
  match: MatchData
  players: Record<string, PlayerData>
}

type KillEvent = {
  killer: string
  victim: string
  headshot: boolean
  weapon: string
}

type grenadeEvents = {
  attacker: string
  team: string
  damage: string
  damageArmor: string
}

export type RoundData = {
  roundNumber: number
  startTime: string
  endTime: string
  duration: number
  winner: string // T or CT
  CT: string // Team name
  T: string // Team name
  sides: Record<string, string> // Map from T/CT to teamName
  score: string // 3-8
  killEvents: KillEvent[]
  grenadeEvent: grenadeEvents[]
}

type MatchData = {
  map: string
  date: string
  teams: string[] // [team1, team2]
  rounds: RoundData[]
  numberOfRounds: number
}

export type PlayerData = {
  name: string
  kills: number
  deaths: number
  team: string
  grenadeDamage: number
}

export function parseMatchData(): ParsedStatistics {
  const logs = nuke
  const lines = logs.split('\n').filter((line) => line.trim().length > 0)

  let recording = false
  let currentRound: RoundData | null = null
  const matchData: MatchData = { map: '', date: '', teams: [], rounds: [], numberOfRounds: 0 }
  let players: Record<string, PlayerData> = {}

  // Regex Patterns
  const matchStartRegex = /World triggered "Match_Start".*?on "(.*?)"/
  const roundStartRegex = /World triggered "Round_Start"/
  const killRegex =
    /"(.+?)<\d+><STEAM_\d+:\d+:\d+><(.*?)>" \[.*?\] killed "(.+?)<\d+><STEAM_\d+:\d+:\d+><(.*?)>" \[.*?\] with "(.*?)"( \(headshot\))?/
  const heDamageRegex =
    /^.+? "(.+?)<\d+><STEAM_\d+:\d+:\d+><(.*?)>" \[.*?\] (killed|attacked) "(.+?)<\d+><STEAM_\d+:\d+:\d+><.*?>" \[.*?\] with "hegrenade"(?: \(damage "(\d+)"\))?(?: \(damage_armor "(\d+)"\))?/
  const inferneDamageRegex =
    /^.+? "(.+?)<\d+><STEAM_\d+:\d+:\d+><(.*?)>" \[.*?\] (killed|attacked) "(.+?)<\d+><STEAM_\d+:\d+:\d+><.*?>" \[.*?\] with "inferno"(?: \(damage "(\d+)"\))?(?: \(damage_armor "(\d+)"\))?/
  const winnerRegEx =
    /^\d+\/\d+\/\d+ - \d+:\d+:\d+: Team "(CT|TERRORIST)" triggered "SFUI_Notice_(CTs|Terrorists)_Win" \(CT "(\d+)"\) \(T "(\d+)"\)/
  const bombRegEx =
    /^\d+\/\d+\/\d+ - \d+:\d+:\d+: Team "TERRORIST" triggered "SFUI_Notice_Target_Bombed" \(CT "(\d+)"\) \(T "(\d+)"\)/
  const defuseRegEx =
    /^\d+\/\d+\/\d+ - \d+:\d+:\d+: Team "CT" triggered "SFUI_Notice_Bomb_Defused" \(CT "(\d+)"\) \(T "(\d+)"\)/

  const scoreRegex = /MatchStatus: Score: (\d+):(\d+)/
  const teamCTRegEx = /MatchStatus: Team playing "CT":\s*(.+)/
  const teamTRegEx = /MatchStatus: Team playing "TERRORIST":\s*(.+)/
  const roundEndRegex = /World triggered "Round_End"/

  for (const line of lines) {
    // Match Start
    const matchStartMatch = line.match(matchStartRegex)
    if (matchStartMatch) {
      if (recording) {
        currentRound = null
        players = {}
      }

      recording = true
      matchData.map = matchStartMatch[1]
      matchData.date = line.split(' - ')[0] // Capture date
      continue
    }

    if (!recording) continue

    // Round Start
    if (line.match(roundStartRegex)) {
      if (currentRound) {
        matchData.rounds.push(currentRound)
      }

      currentRound = {
        roundNumber: matchData.rounds.length + 1,
        duration: 0,
        startTime: '',
        endTime: '',
        winner: '',
        CT: '',
        T: '',
        sides: {},
        score: '',
        killEvents: [],
        grenadeEvent: [],
      }
      currentRound.startTime = line.split(' - ')[1].split(': ')[0] // Capture time.
      continue
    }

    const scoreMatch = line.match(scoreRegex)
    if (scoreMatch && currentRound) {
      const [, ctScore, tScore] = scoreMatch
      currentRound.score = `${ctScore}-${tScore}`
    }

    const teamCT = line.match(teamCTRegEx)
    if (teamCT && currentRound) {
      const teamName = teamCT[1]
      if (!matchData.teams.includes(teamName)) {
        matchData.teams.push(teamName)
      }
      currentRound.CT = teamName
      currentRound.sides['CT'] = teamName
    }

    const teamT = line.match(teamTRegEx)
    if (teamT && currentRound) {
      const teamName = teamT[1]
      if (!matchData.teams.includes(teamName)) {
        matchData.teams.push(teamName)
      }
      currentRound.T = teamName
      currentRound.sides['TERRORIST'] = teamName
    }

    const bombWentOff = line.match(bombRegEx)
    if (bombWentOff && currentRound) {
      currentRound.winner = 'TERRORIST'
    }

    const bombWasDefused = line.match(defuseRegEx)
    if (bombWasDefused && currentRound) {
      currentRound.winner = 'CT'
    }

    const roundWon = line.match(winnerRegEx)
    if (roundWon && currentRound) {
      const [, winningTeam, , ,] = roundWon
      currentRound.winner = winningTeam
    }

    // Round End
    if (line.match(roundEndRegex)) {
      if (currentRound) {
        currentRound.endTime = line.split(' - ')[1].split(': ')[0] // Capture time.
        const start = new Date(`1970-01-01T${currentRound.startTime}Z`).getTime()
        const end = new Date(`1970-01-01T${currentRound.endTime}Z`).getTime()
        currentRound.duration = (end - start) / 1000 // Duration in seconds.

        matchData.rounds.push(currentRound)
        matchData.numberOfRounds = matchData.numberOfRounds + 1
        currentRound = null
      }
      continue
    }

    // Player Kills
    const killMatch = line.match(killRegex)
    if (killMatch && currentRound) {
      const [, killer, killerTeam, victim, victimTeam, weapon, headshotFlag] = killMatch
      const headshot = Boolean(headshotFlag)

      // Record the kill event
      currentRound.killEvents.push({ killer, victim, headshot, weapon })

      // Update player stats
      if (!players[killer])
        players[killer] = { name: killer, kills: 0, deaths: 0, team: killerTeam, grenadeDamage: 0 }

      if (!players[victim])
        players[victim] = { name: victim, kills: 0, deaths: 0, team: victimTeam, grenadeDamage: 0 }

      players[killer].kills += 1
      players[victim].deaths += 1
    }

    const infernoDamage = line.match(inferneDamageRegex)
    if (infernoDamage && currentRound) {
      const [, attacker, team, , , damage, damageArmor] = infernoDamage
      if (!damage) continue

      players[attacker].grenadeDamage += Number(damage) + Number(damageArmor)

      currentRound.grenadeEvent.push({
        attacker: attacker,
        team: team,
        damage: damage,
        damageArmor: damageArmor,
      })
    }
    const heDamage = line.match(heDamageRegex)
    if (heDamage && currentRound) {
      const [, attacker, team, , , damage, damageArmor] = heDamage

      players[attacker].grenadeDamage += Number(damage) + Number(damageArmor)

      currentRound.grenadeEvent.push({
        attacker: attacker,
        team: team,
        damage: damage,
        damageArmor: damageArmor,
      })
    }
  }

  return { match: matchData, players }
}
