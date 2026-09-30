import { useState } from "react";
import { Section } from "./Topo.jsx";
import Icon from "./Icon.jsx";
import WorldMap from "./WorldMap.jsx";
import { Reveal, SplitText } from "./motion.jsx";
import { perks } from "../content.jsx";
import { useNow } from "../hooks/useFrame.js";
import { useInView } from "../hooks/useInView.js";
import { JHB, SHIFT, THEM, VAN, fmt, gap, hm, hoursIn, intersect, mood, nice, pieces, total } from "../lib/time.js";

function City({ label, tz, align }) {
  const now = useNow(1000);
  return (
    <div className="city" style={{ textAlign: align }}>
      <span>{label}</span>
      <b>{fmt(tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }, now)}</b>
      <em>{mood(hoursIn(tz, now))}</em>
    </div>
  );
}

function Lane({ segs, cls, show }) {
  return (
    <div className="lane">
      {segs.map(([a, b]) => (
        <i key={a} className={`seg ${cls}`} style={{ left: `${(a / 24) * 100}%`, width: show ? `${((b - a) / 24) * 100}%` : 0 }}>
          {b - a >= 3 ? `${hm(a)}–${hm(b)}` : ""}
        </i>
      ))}
    </div>
  );
}

function NowLine() {
  const now = useNow(60000);
  return <div className="now" style={{ left: `${(hoursIn(JHB, now) / 24) * 100}%` }} />;
}

// my working day against WildEye's, in Johannesburg time; the slider moves my start
function DayRelay() {
  const [start, setStart] = useState(6);
  const [ref, inView] = useInView();
  const g = gap();
  const them = [THEM], me = pieces(start + g, SHIFT), both = intersect(me, them);
  const b = total(both), cover = total(them) + total(me) - b;

  return (
    <div ref={ref} data-rv="" className={`relay glass${inView ? " in" : ""}`}>
      <div className="relay-head">
        <div>
          <h3>How a working day would look, in Johannesburg time</h3>
          <p>Drag the slider to pick my start time. I'm happy to work to your schedule.</p>
        </div>
        <div className="slider">
          <label htmlFor="start">I start at <output>{hm(start)}</output> in Vancouver</label>
          <input id="start" type="range" min="4" max="10" step="0.5" value={start} onChange={(e) => setStart(+e.target.value)} />
        </div>
      </div>
      <div className="lanes">
        <div className="lane-row"><span>Your team</span><Lane segs={them} cls="them" show={inView} /></div>
        <div className="lane-row"><span>Me</span><Lane segs={me} cls="me" show={inView} /></div>
        <div className="lane-row"><span>Both online</span><Lane segs={both} cls="both" show={inView} /></div>
        <div className="hours"><span /><div><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div></div>
        <div className="now-track"><NowLine /></div>
      </div>
      <div className="sums">
        <div><b>{hm(start + g)}</b>my start, your time</div>
        <div><b>{b ? `${nice(b)} ${b === 1 ? "hour" : "hours"}` : "None"}</b>for calls every weekday</div>
        <div><b>{nice(cover)} hours</b>a day with one of us online</div>
      </div>
      <p className="dst">Since March 2026, British Columbia keeps the same time all year, and so does South Africa. We'd always be exactly 9 hours apart, with no clock changes to plan around.</p>
    </div>
  );
}

export default function TimeZones() {
  return (
    <Section id="hours" topo="paper" seed={53} base={70}>
      <div className="wrap">
        <p className="kicker">04 · Working from Vancouver</p>
        <SplitText text="Your night is my day" />
        <p className="lede">You'd prefer someone in Johannesburg, and I understand why. Here's the upside of Vancouver: it's <b>exactly 9 hours behind you, all year</b>. TrapTagger has a developer online while your team sleeps, and we still overlap every day.</p>

        <Reveal className="map-wrap">
          <div className="map-legend" aria-hidden="true">
            <span><i style={{ background: "#ffd257" }} />Sun, right now</span>
            <span><i style={{ background: "rgba(3,12,10,.8)", boxShadow: "0 0 0 1px rgba(255,255,255,.3)" }} />Night side</span>
          </div>
          <WorldMap />
          <div className="map-cards">
            <City label="Vancouver · UTC−7" tz={VAN} />
            <City label="Johannesburg · SAST" tz={JHB} align="right" />
          </div>
        </Reveal>

        <DayRelay />

        <div className="perks">
          <Reveal className="perk night">
            <img src="img/night-leopard.webp" alt="" loading="lazy" width="1200" height="778" />
            <div className="ico"><Icon name="moon" size={22} /></div>
            <h3>Night cover</h3>
            <p>If an upload or a processing job breaks after your team logs off, I can have it fixed before you wake up.</p>
          </Reveal>
          {perks.map((p, i) => (
            <Reveal key={p.title} className={`perk ${p.fly ? "fly" : "glass"}`} delay={((i + 1) % 2) * 90}>
              <div className="ico"><Icon name={p.icon} size={22} /></div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
