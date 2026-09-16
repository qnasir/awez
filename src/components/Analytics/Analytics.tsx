import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import {
  KPIS, MONTHS, REVENUE_SERIES, REVENUE_PREV, MEMBER_SERIES,
  ATTENDANCE_HOURS, RENEWALS, RETENTION_CURVE, LEAD_SOURCES, TRAINER_PERFORMANCE,
} from '@/lib/content'
import { AreaLineChart, ColumnChart, StackedColumnChart, HBarChart, Sparkline, VIZ } from '@/components/primitives/charts'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { Counter } from '@/components/primitives/Counter'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { cn } from '@/lib/utils'

const SPARKS: Record<string, number[]> = {
  revenue: REVENUE_SERIES.slice(-8),
  members: MEMBER_SERIES.slice(-8),
  leads: [121, 134, 128, 149, 152, 161, 158, 176],
  renewals: [62, 58, 71, 66, 54, 49, 52, 47],
  attendance: [310, 296, 341, 368, 352, 381, 394, 418],
  pending: [104, 98, 91, 86, 79, 74, 69, 64],
}

/**
 * The numbers section. Every chart here is a real, readable chart — measured
 * layout, clean ticks, a crosshair on hover, and a hidden data table so the
 * same information is available without colour, motion or a pointer.
 */
export function Analytics() {
  return (
    <Section id="resources" aria-labelledby="analytics-heading">
      <GridBackdrop size={88} opacity={0.04} />

      <div className="container-x">
        <SectionHeader
          id="analytics-heading"
          eyebrow="Analytics"
          lines={['YOUR GYM HAS DATA.', 'WE TURN IT INTO DECISIONS.']}
          accentLine={1}
          body="Not a report you export and forget. The six numbers that decide the month, on one board, updated as the floor moves."
          className="max-w-5xl"
        />

        {/* ---- KPI row ---- */}
        <ul className="mt-14 grid grid-cols-2 gap-3 md:mt-16 lg:grid-cols-3">
          {KPIS.map((kpi, i) => {
            const good = kpi.id === 'renewals' || kpi.id === 'pending' ? kpi.trend === 'down' : kpi.trend === 'up'
            return (
              <Reveal key={kpi.id} delay={i * 0.06} distance={18} speed="product" as="li">
                <Panel className="h-full p-4 md:p-5">
                  <p className="text-[0.625rem] uppercase tracking-[0.12em] text-dim md:text-[0.6875rem]">
                    {kpi.label}
                  </p>
                  {/* Stacked on a phone: at two columns the value and the trend
                      line cannot share a row without one of them being clipped. */}
                  <div className="mt-2.5 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                    <span className="font-display text-[1.5rem] font-extrabold leading-none tracking-tight text-chalk sm:text-[1.75rem] md:text-[2.125rem]">
                      <Counter to={kpi.value} prefix={kpi.prefix} duration={1.7} delay={i * 0.06} />
                    </span>
                    <Sparkline data={SPARKS[kpi.id]} width={72} height={26} delay={0.3 + i * 0.06} />
                  </div>
                  <p
                    className={cn(
                      'mt-3 flex items-center gap-1 text-[0.75rem] font-medium tabular-nums',
                      good ? 'text-volt' : 'text-ember',
                    )}
                  >
                    {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(kpi.delta)}%
                    <span className="font-normal text-dim">vs last month</span>
                  </p>
                </Panel>
              </Reveal>
            )
          })}
        </ul>

        {/* ---- Charts ---- */}
        <div className="mt-4 grid gap-3 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" distance={24} speed="product">
            <Panel className="h-full p-5 md:p-6">
              <AreaLineChart
                title="Revenue"
                subtitle="Monthly, in ₹ lakh — this year against last"
                labels={MONTHS}
                height={252}
                format={(v) => `₹${v.toFixed(1)}L`}
                tableCaption="Monthly revenue in lakh rupees, this year compared with last year"
                series={[
                  { label: 'Last year', data: REVENUE_PREV, color: VIZ.muted, context: true },
                  { label: 'This year', data: REVENUE_SERIES, color: VIZ.volt },
                ]}
              />
            </Panel>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08} distance={24} speed="product">
            <Panel className="h-full p-5 md:p-6">
              <ColumnChart
                title="Check-ins by hour"
                subtitle="A typical weekday"
                data={ATTENDANCE_HOURS.map((h) => ({ label: h.hour, value: h.v }))}
                height={252}
                annotate={14}
                annotateText="96 · peak"
                tableCaption="Member check-ins by hour on a typical weekday"
              />
            </Panel>
          </Reveal>

          <Reveal className="lg:col-span-4" distance={24} speed="product">
            <Panel className="h-full p-5 md:p-6">
              <StackedColumnChart
                title="Renewals"
                subtitle="Outcome of every expiring membership"
                data={RENEWALS.map((r) => ({ label: r.month, a: r.renewed, b: r.lapsed }))}
                names={['Renewed', 'Lapsed']}
                height={210}
                tableCaption="Renewed versus lapsed memberships over the last six months"
              />
            </Panel>
          </Reveal>

          <Reveal className="lg:col-span-4" delay={0.07} distance={24} speed="product">
            <Panel className="h-full p-5 md:p-6">
              <AreaLineChart
                title="Retention"
                subtitle="% of a joining cohort still active"
                labels={MONTHS.map((_, i) => `M${i}`)}
                height={210}
                format={(v) => `${v}%`}
                tableCaption="Percentage of a joining cohort still active by month"
                series={[{ label: 'Cohort retention', data: RETENTION_CURVE, color: VIZ.volt }]}
              />
            </Panel>
          </Reveal>

          <Reveal className="lg:col-span-4" delay={0.14} distance={24} speed="product">
            <Panel className="h-full p-5 md:p-6">
              <HBarChart
                title="Where members come from"
                subtitle="Share of new joins this month"
                data={LEAD_SOURCES.map((s) => ({ label: s.source, value: s.value }))}
                tableCaption="Share of new member joins by acquisition source"
              />
            </Panel>
          </Reveal>
        </div>

        {/* ---- Trainer table: the right form for ranked multi-column data ---- */}
        <Reveal delay={0.05} distance={24} speed="product" className="mt-3">
          <Panel className="p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[0.9375rem] font-semibold text-chalk">Trainer performance</h3>
              <p className="text-xs text-smoke">March · sessions delivered</p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {['Trainer', 'Sessions', 'Rating', 'Client retention'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="pb-2.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-dim"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRAINER_PERFORMANCE.map((t) => (
                    <tr key={t.name} className="border-b border-line/60 last:border-b-0">
                      <th scope="row" className="py-3 text-sm font-medium text-chalk">{t.name}</th>
                      <td className="py-3 font-mono text-sm tabular-nums text-ash">{t.sessions}</td>
                      <td className="py-3 font-mono text-sm tabular-nums text-ash">{t.rating}</td>
                      <td className="py-3">
                        <span className="flex items-center gap-2.5">
                          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                            <span
                              className="block h-full rounded-r-[4px] bg-volt"
                              style={{ width: `${t.retention}%` }}
                            />
                          </span>
                          <span className="font-mono text-xs tabular-nums text-ash">{t.retention}%</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}
