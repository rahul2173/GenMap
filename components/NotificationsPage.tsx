
import React, { useState } from 'react';
import { FamilyMember, FamilyNotification } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationsPageProps {
  members: FamilyMember[];
}

const MOCK_NOTIFICATIONS: FamilyNotification[] = [
  {
    id: 'n1',
    type: 'tree',
    title: 'New Branch Added',
    description: 'Julian Sterling added 2 new members to the Miller branch.',
    timestamp: '10 mins ago',
    isRead: false,
    senderId: '3',
    actionLabel: 'View Tree'
  },
  {
    id: 'n2',
    type: 'event',
    title: 'Event Invitation',
    description: 'Eleanor Sterling invited you to "Julian\'s Graduation Party".',
    timestamp: '2 hours ago',
    isRead: false,
    senderId: '2',
    actionLabel: 'RSVP'
  },
  {
    id: 'n3',
    type: 'message',
    title: 'New Message',
    description: 'Julian: "Hey! Did you see the new branch Julian added?"',
    timestamp: '4 hours ago',
    isRead: true,
    senderId: '3',
    actionLabel: 'Reply'
  },
  {
    id: 'n4',
    type: 'verification',
    title: 'Identity Verified',
    description: 'Your identity has been successfully verified for the Sterling Legacy tree.',
    timestamp: 'Yesterday',
    isRead: true,
    actionLabel: 'View Certificate'
  }
];

const NotificationsPage: React.FC<NotificationsPageProps> = ({ members }) => {
  const [notifications, setNotifications] = useState<FamilyNotification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'tree' | 'events'>('all');
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'tree') return n.type === 'tree';
    if (filter === 'events') return n.type === 'event';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'tree': return 'fa-sitemap text-blue-500 bg-blue-50';
      case 'message': return 'fa-comments text-emerald-500 bg-emerald-50';
      case 'event': return 'fa-calendar-star text-amber-500 bg-amber-50';
      case 'verification': return 'fa-shield-check text-rose-500 bg-rose-50';
      default: return 'fa-bell text-stone-500 bg-stone-50';
    }
  };

  return (
    <div className="h-full bg-stone-50/50 dark:bg-stone-900/50 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-bell"></i>
              </div>
              <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-500">Notifications</h1>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Stay updated with your family's recent activities and changes.</p>
          </div>
          <button 
            onClick={markAllRead}
            className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Mark all as read
          </button>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {['all', 'unread', 'tree', 'events'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                filter === f 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white dark:bg-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, idx) => {
              const sender = members.find(m => m.id === notif.senderId);
              return (
                <div 
                  key={notif.id}
                  className={`group relative bg-white dark:bg-stone-800 p-5 rounded-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 flex gap-4 ${
                    !notif.isRead ? 'border-amber-200 dark:border-amber-900/30 shadow-sm' : 'border-stone-100 dark:border-stone-700'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {!notif.isRead && (
                    <div className="absolute top-5 right-5 w-2 h-2 bg-amber-400 rounded-full"></div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-stone-100 dark:border-stone-700 ${getIcon(notif.type).split(' ')[1]} ${getIcon(notif.type).split(' ')[2]}`}>
                    <i className={`fa-solid ${getIcon(notif.type).split(' ')[0]} text-lg`}></i>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm">{notif.title}</h3>
                      <span className="text-[10px] text-stone-400 font-semibold">{notif.timestamp}</span>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mb-4">{notif.description}</p>
                    
                    <div className="flex items-center gap-3">
                      {notif.actionLabel && (
                        <button 
                          onClick={() => notif.type === 'tree' ? navigate('/') : navigate('/social')}
                          className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          {notif.actionLabel}
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="text-[10px] text-stone-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 uppercase font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {sender && (
                    <div className="shrink-0 flex flex-col items-center">
                      <img src={sender.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-stone-700 shadow-sm object-cover" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
              <i className="fa-solid fa-bell-slash text-5xl mb-4 text-stone-400"></i>
              <p className="font-bold text-stone-500">No notifications found in this category.</p>
              <p className="text-xs">You're all caught up with your family history!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
