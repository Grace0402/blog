'use client';
import { useState } from 'react';

export default function Calendar() {
  var now = new Date();
  var _useState = useState(now.getFullYear()), year = _useState[0], setYear = _useState[1];
  var _useState2 = useState(now.getMonth()), month = _useState2[0], setMonth = _useState2[1];
  var today = now.getDate();
  var todayMonth = now.getMonth();
  var todayYear = now.getFullYear();

  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var firstDay = new Date(year, month, 1).getDay();

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else { setMonth(month - 1); }
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else { setMonth(month + 1); }
  }

  var cells = [];
  for (var i = 0; i < firstDay; i++) {
    cells.push(<div key={'e'+i} className="text-center text-xs py-0.5" />);
  }
  for (var d = 1; d <= daysInMonth; d++) {
    var isToday = d === today && month === todayMonth && year === todayYear;
    cells.push(
      <div
        key={'d'+d}
        className={'text-center text-xs py-0.5 rounded-full ' + (isToday ? 'bg-amber-500 text-white font-bold' : 'text-stone-600 dark:text-stone-300')}
      >{d}</div>
    );
  }

  var weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="soft-glass-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="text-stone-400 hover:text-amber-500 transition-colors">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="text-sm font-bold text-stone-700 dark:text-stone-200">{monthNames[month]} {year}</span>
        <button onClick={nextMonth} className="text-stone-400 hover:text-amber-500 transition-colors">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map(function(d) { return <div key={d} className="text-center text-xs text-stone-400 py-0.5">{d}</div>; })}
        {cells}
      </div>
    </div>
  );
}
