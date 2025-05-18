// src/components/ContributionHeatmap.tsx
'use client';

import React from 'react';

type Day = {
  date: string;
  count: number;
  level: number; // 0〜4の濃さレベル（GitHub風）
};

type Props = {
  contributions: Day[];
};

const levelColor = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

export default function ContributionHeatmap({ contributions }: Props) {
  const weeks = groupByWeek(contributions);

  return (
    <div className="overflow-x-auto">
      <svg width={weeks.length * 14} height={7 * 14}>
        {weeks.map((week, x) =>
          week.map((day, y) => (
            <rect
              key={day.date}
              x={x * 14}
              y={y * 14}
              width={12}
              height={12}
              fill={levelColor[day.level]}
            >
              <title>{`${day.date}: ${day.count} contributions`}</title>
            </rect>
          ))
        )}
      </svg>
    </div>
  );
}

function groupByWeek(days: Day[]): Day[][] {
  const weeks: Day[][] = [];
  let week: Day[] = [];

  for (let i = 0; i < days.length; i++) {
    week.push(days[i]);

    // 1週間ごとに分ける（日曜日始まり）
    if (new Date(days[i].date).getDay() === 6 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  }

  return weeks;
}
