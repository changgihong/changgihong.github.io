import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

// Execute the published code blocks so that tests also cover edits to the notes.
function readCode(slug) {
  const source = readFileSync(
    new URL(`../content/wiki/${slug}.mdx`, import.meta.url),
    'utf8',
  )
  const blocks = [...source.matchAll(/```js\n([\s\S]*?)\n```/g)]
  assert.equal(blocks.length, 1, `${slug}: expected one complete solution`)
  return new vm.Script(`'use strict';\n${blocks[0][1]}`, {
    filename: `${slug}.js`,
  })
}

function programmers(slug) {
  const context = vm.createContext({})
  readCode(slug).runInContext(context, { timeout: 5000 })
  return (...args) => {
    const input = structuredClone(args)
    const result = context.solution(...input)
    assert.deepEqual(input, args, `${slug}: input must remain unchanged`)
    return JSON.parse(JSON.stringify(result))
  }
}

function boj(slug) {
  const script = readCode(slug)
  return (input) => {
    const output = []
    const context = vm.createContext({
      require(name) {
        assert.equal(name, 'fs')
        return {
          readFileSync(fd, encoding) {
            assert.equal(fd, 0)
            assert.equal(encoding, 'utf8')
            return input
          },
        }
      },
      console: { log: (value) => output.push(String(value)) },
    })
    script.runInContext(context, { timeout: 5000 })
    return output.join('\n')
  }
}

// A fixed seed makes randomized counterexamples reproducible.
let seed = 20260927
function random(limit) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  return seed % limit
}
function shuffle(items) {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
function time(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

// Brute-force references use different strategies from the published solutions.
function boxScore(cards) {
  let best = 0
  for (let first = 0; first < cards.length; first++) {
    for (let second = 0; second < cards.length; second++) {
      const opened = new Set()
      const play = (start) => {
        let count = 0
        while (!opened.has(start)) {
          opened.add(start)
          count += 1
          start = cards[start] - 1
        }
        return count
      }
      const firstSize = play(first)
      best = Math.max(best, firstSize * play(second))
    }
  }
  return best
}
function islandTotals(maps) {
  const cols = maps[0].length
  const parent = Array.from({ length: maps.length * cols }, (_, i) => i)
  const root = (index) => {
    while (parent[index] !== index) index = parent[index]
    return index
  }
  for (let row = 0; row < maps.length; row++) {
    for (let col = 0; col < cols; col++) {
      if (maps[row][col] === 'X') continue
      for (const [nr, nc] of [
        [row + 1, col],
        [row, col + 1],
      ]) {
        if (nr < maps.length && nc < cols && maps[nr][nc] !== 'X') {
          parent[root(row * cols + col)] = root(nr * cols + nc)
        }
      }
    }
  }
  const totals = new Map()
  for (let row = 0; row < maps.length; row++) {
    for (let col = 0; col < cols; col++) {
      if (maps[row][col] === 'X') continue
      const key = root(row * cols + col)
      totals.set(key, (totals.get(key) ?? 0) + Number(maps[row][col]))
    }
  }
  return totals.size ? [...totals.values()].sort((a, b) => a - b) : [-1]
}
function occupiedRooms(bookings) {
  const minutes = (text) => {
    const [hour, minute] = text.split(':').map(Number)
    return hour * 60 + minute
  }
  const occupancy = Array(1450).fill(0)
  for (const [start, end] of bookings) {
    for (let t = minutes(start); t < minutes(end) + 10; t++) occupancy[t]++
  }
  return Math.max(...occupancy)
}
function reverseShortest(start, target, memo = new Map()) {
  if (target <= start) return start - target
  if (target === 1) return 1
  if (memo.has(target)) return memo.get(target)
  // Consider walking directly or the final doubling, in reverse.
  const viaDouble =
    target % 2 === 0
      ? 1 + reverseShortest(start, target / 2, memo)
      : 2 +
        Math.min(
          reverseShortest(start, (target - 1) / 2, memo),
          reverseShortest(start, (target + 1) / 2, memo),
        )
  const result = Math.min(target - start, viaDouble)
  memo.set(target, result)
  return result
}
function palindromeType(word) {
  const palindrome = (text) => text === [...text].reverse().join('')
  if (palindrome(word)) return 0
  for (let i = 0; i < word.length; i++) {
    if (palindrome(word.slice(0, i) + word.slice(i + 1))) return 1
  }
  return 2
}
function taskOrder(plans) {
  const tasks = plans
    .map(([name, start, duration]) => {
      const [hour, minute] = start.split(':').map(Number)
      return { name, start: hour * 60 + minute, remaining: Number(duration) }
    })
    .sort((a, b) => a.start - b.start)
  const pending = []
  const answer = []
  let next = 0
  for (let t = tasks[0].start; answer.length < tasks.length; t++) {
    if (next < tasks.length && tasks[next].start === t)
      pending.push(tasks[next++])
    if (!pending.length) continue
    const current = pending[pending.length - 1]
    current.remaining--
    if (current.remaining === 0) answer.push(pending.pop().name)
  }
  return answer
}
function shortestWindow(sequence, k) {
  let best
  for (let start = 0; start < sequence.length; start++) {
    let sum = 0
    for (let end = start; end < sequence.length; end++) {
      sum += sequence[end]
      if (sum === k && (!best || end - start < best[1] - best[0]))
        best = [start, end]
    }
  }
  return best
}
function minimumShots(targets) {
  // Exhaustively cover intervals with subsets of all possible half-integer shots.
  const candidates = [...new Set(targets.flat())].map((end) => end - 0.5)
  let best = targets.length
  for (let mask = 1; mask < 2 ** candidates.length; mask++) {
    const shots = candidates.filter((_, i) => mask & (1 << i))
    if (shots.length >= best) continue
    if (
      targets.every(([start, end]) => shots.some((x) => start < x && x < end))
    )
      best = shots.length
  }
  return best
}
function maximumMeetings(meetings) {
  // Try every chronological schedule, including every order of zero-length ties.
  const search = (end, mask) => {
    let best = 0
    for (let i = 0; i < meetings.length; i++) {
      if (!(mask & (1 << i)) && meetings[i][0] >= end) {
        best = Math.max(best, 1 + search(meetings[i][1], mask | (1 << i)))
      }
    }
    return best
  }
  return search(-Infinity, 0)
}
function seatArrangements(n, vips) {
  const fixed = new Set(vips)
  let answer = 0
  const place = (person, used) => {
    if (person > n) {
      answer++
      return
    }
    for (
      let seat = Math.max(1, person - 1);
      seat <= Math.min(n, person + 1);
      seat++
    ) {
      if (used.has(seat)) continue
      if ((fixed.has(person) || fixed.has(seat)) && seat !== person) continue
      used.add(seat)
      place(person + 1, used)
      used.delete(seat)
    }
  }
  place(1, new Set())
  return answer
}

const cases = 200

test('131130: examples, one cycle, singleton groups and random game simulations', () => {
  const solve = programmers('131130')
  assert.equal(solve([8, 6, 3, 7, 2, 5, 1, 4]), 12)
  assert.equal(
    solve(Array.from({ length: 100 }, (_, i) => ((i + 1) % 100) + 1)),
    0,
  )
  assert.equal(solve(Array.from({ length: 100 }, (_, i) => i + 1)), 1)
  for (let i = 0; i < cases; i++) {
    const cards = shuffle(
      Array.from({ length: 2 + random(8) }, (_, j) => j + 1),
    )
    assert.equal(solve(cards), boxScore(cards))
  }
})

test('154540: examples, non-square maps, diagonals and 100×100 islands without recursion', () => {
  const solve = programmers('154540')
  assert.deepEqual(solve(['X591X', 'X1X5X', 'X231X', '1XXX1']), [1, 1, 27])
  assert.deepEqual(solve(['XXX', 'XXX', 'XXX']), [-1])
  assert.deepEqual(solve(['1XX', 'X2X', 'XX3']), [1, 2, 3])
  assert.deepEqual(solve(Array(100).fill('9'.repeat(100))), [90000])
  for (let i = 0; i < cases; i++) {
    const cols = 3 + random(4)
    const maps = Array.from({ length: 3 + random(4) }, () =>
      Array.from({ length: cols }, () =>
        random(3) === 0 ? 'X' : String(1 + random(9)),
      ).join(''),
    )
    assert.deepEqual(solve(maps), islandTotals(maps))
  }
})

test('155651: examples, cleanup equality, midnight and occupancy reference', () => {
  const solve = programmers('155651')
  assert.equal(
    solve([
      ['15:00', '17:00'],
      ['16:40', '18:20'],
      ['14:20', '15:20'],
      ['14:10', '19:20'],
      ['18:20', '21:20'],
    ]),
    3,
  )
  assert.equal(
    solve([
      ['09:10', '10:10'],
      ['10:20', '12:20'],
    ]),
    1,
  )
  assert.equal(solve(Array(3).fill(['10:20', '12:30'])), 3)
  assert.equal(
    solve([
      ['09:10', '10:10'],
      ['10:19', '12:20'],
    ]),
    2,
  )
  assert.equal(
    solve([
      ['23:58', '23:59'],
      ['00:00', '00:01'],
    ]),
    1,
  )
  assert.equal(solve(Array(1000).fill(['00:00', '23:59'])), 1000)
  for (let i = 0; i < cases; i++) {
    const bookings = Array.from({ length: 1 + random(20) }, () => {
      const start = random(1439)
      return [time(start), time(start + 1 + random(1439 - start))]
    })
    assert.equal(solve(bookings), occupiedRooms(bookings))
  }
})

test('1697: example, zero, equal endpoints, limits and reverse shortest-path reference', () => {
  const solve = boj('1697')
  assert.equal(solve('5 17\n'), '4')
  for (const [start, target] of [
    [0, 0],
    [100000, 100000],
    [0, 1],
    [100000, 0],
    [0, 100000],
    [50001, 100000],
    [1, 100000],
  ]) {
    assert.equal(
      solve(`${start} ${target}\r\n`),
      String(reverseShortest(start, target)),
    )
  }
  for (let i = 0; i < cases; i++) {
    const start = random(100001)
    const target = random(100001)
    assert.equal(
      solve(`${start} ${target}`),
      String(reverseShortest(start, target)),
    )
  }
})

test('17609: sample, either deletion, exhaustive short words, CRLF and long input', () => {
  const solve = boj('17609')
  assert.equal(
    solve('7\nabba\nsummuus\nxabba\nxabbay\ncomcom\ncomwwmoc\ncomwwtmoc\n'),
    '0\n1\n1\n2\n2\n0\n1',
  )
  const words = ['xabba', 'abbax']
  for (let length = 3; length <= 9; length++) {
    for (let mask = 0; mask < 2 ** length; mask++) {
      words.push(
        Array.from({ length }, (_, i) => (mask & (1 << i) ? 'a' : 'b')).join(
          '',
        ),
      )
    }
  }
  assert.equal(
    solve(`${words.length}\r\n${words.join('\r\n')}\r\n`),
    words.map(palindromeType).join('\n'),
  )
  assert.equal(
    solve(`2\n${'a'.repeat(100000)}\n${'a'.repeat(99999)}b\n`),
    '0\n1',
  )
})

test('176962: all examples, preemption ties, idle gaps and minute-by-minute reference', () => {
  const solve = programmers('176962')
  assert.deepEqual(
    solve([
      ['korean', '11:40', '30'],
      ['english', '12:10', '20'],
      ['math', '12:30', '40'],
    ]),
    ['korean', 'english', 'math'],
  )
  assert.deepEqual(
    solve([
      ['science', '12:40', '50'],
      ['music', '12:20', '40'],
      ['history', '14:00', '30'],
      ['computer', '12:30', '100'],
    ]),
    ['science', 'history', 'computer', 'music'],
  )
  assert.deepEqual(
    solve([
      ['aaa', '12:00', '20'],
      ['bbb', '12:10', '30'],
      ['ccc', '12:40', '10'],
    ]),
    ['bbb', 'ccc', 'aaa'],
  )
  assert.deepEqual(
    solve([
      ['aaa', '12:00', '30'],
      ['bbb', '12:10', '5'],
      ['ccc', '13:00', '10'],
    ]),
    ['bbb', 'aaa', 'ccc'],
  )
  assert.deepEqual(
    solve([
      ['aaa', '23:57', '100'],
      ['bbb', '23:58', '100'],
      ['ccc', '23:59', '100'],
    ]),
    ['ccc', 'bbb', 'aaa'],
  )
  for (let i = 0; i < cases; i++) {
    const starts = shuffle(Array.from({ length: 100 }, (_, j) => j * 10)).slice(
      0,
      3 + random(7),
    )
    const plans = starts.map((start, j) => [
      `task${String.fromCharCode(97 + j)}`,
      time(start),
      String(1 + random(100)),
    ])
    assert.deepEqual(solve(plans), taskOrder(plans))
  }
  const plans = Array.from({ length: 1000 }, (_, i) => [
    `task${String.fromCharCode(97 + Math.floor(i / 676), 97 + (Math.floor(i / 26) % 26), 97 + (i % 26))}`,
    time(i),
    '100',
  ])
  assert.deepEqual(solve(plans), taskOrder(plans))
})

test('178870: examples, ties and 1,000,000 values without candidate sorting', () => {
  const solve = programmers('178870')
  assert.deepEqual(solve([1, 2, 3, 4, 5], 7), [2, 3])
  assert.deepEqual(solve([1, 1, 1, 2, 3, 4, 5], 5), [6, 6])
  assert.deepEqual(solve([2, 2, 2, 2, 2], 6), [0, 2])
  for (let i = 0; i < cases; i++) {
    const sequence = Array.from(
      { length: 5 + random(15) },
      () => 1 + random(10),
    ).sort((a, b) => a - b)
    const start = random(sequence.length)
    const end = start + random(sequence.length - start)
    const k = sequence
      .slice(start, end + 1)
      .reduce((sum, value) => sum + value, 0)
    assert.deepEqual(solve(sequence, k), shortestWindow(sequence, k))
  }
  assert.deepEqual(solve(Array(1000000).fill(1), 500000), [0, 499999])
})

test('181188: sample, touching open endpoints, duplicates and exhaustive shot covers', () => {
  const solve = programmers('181188')
  assert.equal(
    solve([
      [4, 5],
      [4, 8],
      [10, 14],
      [11, 13],
      [5, 12],
      [3, 7],
      [1, 4],
    ]),
    3,
  )
  assert.equal(
    solve([
      [1, 2],
      [2, 3],
    ]),
    2,
  )
  assert.equal(
    solve([
      [0, 1],
      [0, 1],
      [0, 1],
    ]),
    1,
  )
  for (let i = 0; i < cases; i++) {
    const targets = Array.from({ length: 1 + random(7) }, () => {
      const start = random(8)
      return [start, start + 1 + random(8 - start)]
    })
    assert.equal(solve(targets), minimumShots(targets))
  }
  assert.equal(solve(Array.from({ length: 500000 }, () => [0, 100000000])), 1)
})

test('1931: sample, zero-length ties, CRLF and exhaustive schedules', () => {
  const solve = boj('1931')
  const run = (meetings) =>
    Number(
      solve(
        `${meetings.length}\r\n${meetings.map((meeting) => meeting.join(' ')).join('\r\n')}\r\n`,
      ),
    )
  assert.equal(
    run([
      [1, 4],
      [3, 5],
      [0, 6],
      [5, 7],
      [3, 8],
      [5, 9],
      [6, 10],
      [8, 11],
      [8, 12],
      [2, 13],
      [12, 14],
    ]),
    4,
  )
  assert.equal(
    run([
      [2, 2],
      [1, 2],
      [2, 2],
      [2, 3],
    ]),
    4,
  )
  assert.equal(run([[0, 0]]), 1)
  for (let i = 0; i < cases; i++) {
    const meetings = Array.from({ length: 1 + random(6) }, () => {
      const start = random(7)
      return [start, start + random(8 - start)]
    })
    assert.equal(run(meetings), maximumMeetings(meetings))
  }
  assert.equal(
    run(Array.from({ length: 100000 }, (_, i) => [i, i + 1])),
    100000,
  )
})

test('2302: sample, all VIP subsets and direct seat-assignment reference', () => {
  const solve = boj('2302')
  const run = (n, vips) =>
    Number(solve([n, vips.length, ...vips].join('\r\n') + '\r\n'))
  assert.equal(run(9, [4, 7]), 12)
  for (let n = 1; n <= 8; n++) {
    for (let mask = 0; mask < 2 ** n; mask++) {
      const vips = Array.from({ length: n }, (_, i) => i + 1).filter(
        (_, i) => mask & (1 << i),
      )
      assert.equal(run(n, vips), seatArrangements(n, vips))
    }
  }
  assert.equal(run(40, []), 165580141)
  assert.equal(
    run(
      40,
      Array.from({ length: 40 }, (_, i) => i + 1),
    ),
    1,
  )
})
