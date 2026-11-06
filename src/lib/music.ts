/**
 * A generative ambient piano — built from pure oscillators.
 * Love theme in A minor, 69 bpm, plucks + soft pad + tape-style delay.
 */

const A2 = 110.0, C3 = 130.81, G2 = 98.0, F2 = 87.31;
const CHORDS: number[][] = [
  // Am9
  [A2, 220.0, 261.63, 329.63, 493.88],
  // Fmaj9
  [F2, 174.61, 220.0, 261.63, 392.0],
  // Cmaj9
  [C3, 164.81, 196.0, 293.66, 329.63, 493.88],
  // Gmaj-ish
  [G2, 196.0, 246.94, 293.66, 440.0],
];

const PATTERN = [0, 2, 3, 4, 3, 2, 1, 3, 2, 4, 3, 2];

class AmbientMusic {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wet: GainNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private chordIdx = 0;
  private step = 0;
  playing = false;

  private ensure() {
    if (this.ctx) return;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;

    // gentle stereo chorus via two delays
    const delayL = ctx.createDelay(2);
    delayL.delayTime.value = 0.461;
    const delayR = ctx.createDelay(2);
    delayR.delayTime.value = 0.623;
    const fb = ctx.createGain();
    fb.gain.value = 0.34;
    const fb2 = ctx.createGain();
    fb2.gain.value = 0.28;
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.5;

    const merger = ctx.createChannelMerger(2);
    delayL.connect(fb).connect(delayR);
    delayR.connect(fb2).connect(delayL);
    delayL.connect(merger, 0, 0);
    delayR.connect(merger, 0, 1);
    merger.connect(this.master);

    this.wet.connect(delayL);
    this.wet.connect(delayR);
    this.wet.connect(this.master);

    // master filter for softness
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    this.master.connect(lp);
    lp.connect(ctx.destination);
  }

  private pluck(freq: number, time: number, vol = 0.16, dur = 2.6) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    const o1 = ctx.createOscillator();
    o1.type = "triangle";
    o1.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 2.001;
    const g2 = ctx.createGain();
    g2.gain.value = 0.22;

    o1.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.wet!);
    o1.start(time);
    o2.start(time);
    o1.stop(time + dur + 0.1);
    o2.stop(time + dur + 0.1);
  }

  private pad(freqs: number[], time: number, chordDur: number) {
    const ctx = this.ctx!;
    for (const f of freqs) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.028, time + chordDur * 0.4);
      g.gain.linearRampToValueAtTime(0.0001, time + chordDur * 1.05);
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(g);
      g.connect(this.master!);
      o.start(time);
      o.stop(time + chordDur * 1.1);
    }
  }

  private schedule = () => {
    if (!this.playing || !this.ctx) return;
    const bpm = 69;
    const eighth = 60 / bpm / 2;
    const chord = CHORDS[this.chordIdx % CHORDS.length];
    const chordDur = eighth * 12;
    const t0 = this.ctx.currentTime + 0.05;

    this.pad([chord[0] * 2, chord[1]], t0, chordDur);

    for (let i = 0; i < PATTERN.length; i++) {
      const t = t0 + i * eighth;
      const idx = PATTERN[i] % chord.length;
      const octave = i % 6 === 5 ? 2 : 1;
      const humanize = (Math.random() - 0.5) * 0.02;
      this.pluck(chord[idx] * octave * 2, t + humanize, 0.1 + Math.random() * 0.05);
    }

    this.chordIdx++;
    this.step++;
    this.timer = setTimeout(this.schedule, chordDur * 1000);
  };

  start() {
    this.ensure();
    if (!this.ctx || this.playing) return;
    void this.ctx.resume();
    this.playing = true;
    const t = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(this.master!.gain.value, t);
    this.master!.gain.linearRampToValueAtTime(0.85, t + 3.5);
    this.schedule();
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    const t = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(this.master!.gain.value, t);
    this.master!.gain.linearRampToValueAtTime(0.0001, t + 1.2);
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start();
  }
}

export const music = new AmbientMusic();
