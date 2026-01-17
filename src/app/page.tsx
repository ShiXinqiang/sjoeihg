"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Clock, Loader2 } from 'lucide-react';

export default function StudyApp() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject: '', duration: '', category: '编程' });

  // 获取数据
  const fetchRecords = async () => {
    const res = await fetch('/api/records');
    const data = await res.json();
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  // 提交数据
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/records', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setForm({ subject: '', duration: '', category: '编程' });
    setShowAdd(false);
    fetchRecords();
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative shadow-2xl">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-6 bg-indigo-600 text-white rounded-b-[2rem] shadow-lg">
          <h1 className="text-xl font-bold">学习记录本</h1>
          <p className="text-xs opacity-70 mt-1">已累计学习 {records.reduce((acc, r) => acc + r.duration, 0)} 分钟</p>
        </header>

        {/* List */}
        <main className="flex-1 p-4 space-y-3 overflow-y-auto pb-24">
          {loading ? (
            <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : records.map((r: any) => (
            <div key={r.id} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mr-3">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800">{r.subject}</h3>
                <p className="text-[10px] text-gray-400">{r.category} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-sm font-mono font-bold text-indigo-600">{r.duration}m</div>
            </div>
          ))}
        </main>

        {/* Floating Button */}
        <button 
          onClick={() => setShowAdd(true)}
          className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        ) {
          <Plus size={28} />
        </button>

        {/* Simple Bottom Nav */}
        <nav className="h-20 border-t flex justify-around items-center bg-white/80 backdrop-blur-md">
           <div className="flex flex-col items-center text-indigo-600"><BookOpen size={20}/><span className="text-[10px] mt-1">首页</span></div>
           <div className="flex flex-col items-center text-gray-400"><Clock size={20}/><span className="text-[10px] mt-1">统计</span></div>
        </nav>

        {/* Add Modal */}
        {showAdd && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50">
            <div className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom">
              <h2 className="text-lg font-bold mb-4">新增学习记录</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  placeholder="学习内容" required
                  className="w-full p-3 bg-gray-100 rounded-xl outline-none"
                  onChange={e => setForm({...form, subject: e.target.value})}
                />
                <input 
                  placeholder="时长 (分钟)" type="number" required
                  className="w-full p-3 bg-gray-100 rounded-xl outline-none"
                  onChange={e => setForm({...form, duration: e.target.value})}
                />
                <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">保存记录</button>
                <button type="button" onClick={() => setShowAdd(false)} className="w-full py-2 text-gray-400 text-sm">取消</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
