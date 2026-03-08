
import React, { useState } from 'react';
import { FamilyMember } from '../types';

interface SocialFeedProps {
  members: FamilyMember[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ members }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');

  const stories = members.slice(0, 5).map(m => ({
    id: m.id,
    name: m.firstName,
    avatar: m.avatar,
    hasUnseen: Math.random() > 0.5
  }));

  const mockPosts = [
    {
      id: 'p1',
      author: members[0],
      content: "Just found some old photos of the family estate. Look how much has changed!",
      image: "https://picsum.photos/id/1014/800/450",
      likes: 12,
      time: "2h ago"
    },
    {
      id: 'p2',
      author: members[1],
      content: "Julian's graduation party is finally happening next week! Hope everyone can make it.",
      image: "https://picsum.photos/id/1012/800/450",
      likes: 24,
      time: "5h ago"
    }
  ];

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto">
      {/* Stories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {stories.map(story => (
          <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer group min-w-[70px]">
            <div className={`w-16 h-16 rounded-full p-1 border-2 transition-transform duration-300 group-hover:scale-105 ${story.hasUnseen ? 'border-amber-400' : 'border-stone-200'}`}>
              <img src={story.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-stone-600">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-stone-200 mb-6">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'feed' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-stone-400'}`}
        >
          Daily Moments
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'events' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-stone-400'}`}
        >
          Family Events & Invites
        </button>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-10">
        {activeTab === 'feed' ? (
          <>
            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
              <div className="flex gap-4">
                <img src={members[0].avatar} className="w-10 h-10 rounded-full" />
                <input 
                  className="flex-1 bg-stone-50 rounded-full px-5 text-sm outline-none focus:ring-1 focus:ring-amber-400" 
                  placeholder="Share something with the family..."
                />
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-50">
                <div className="flex gap-4">
                  <button className="text-stone-500 hover:text-emerald-700 flex items-center gap-2 text-xs font-semibold"><i className="fa-solid fa-image text-amber-500"></i> Photo</button>
                  <button className="text-stone-500 hover:text-emerald-700 flex items-center gap-2 text-xs font-semibold"><i className="fa-solid fa-video text-rose-500"></i> Video</button>
                  <button className="text-stone-500 hover:text-emerald-700 flex items-center gap-2 text-xs font-semibold"><i className="fa-solid fa-calendar-star text-blue-500"></i> Event</button>
                </div>
                <button className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700">Post</button>
              </div>
            </div>

            {/* Posts */}
            {mockPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold text-stone-800">{post.author.firstName} {post.author.lastName}</p>
                      <p className="text-[10px] text-stone-400">{post.time}</p>
                    </div>
                  </div>
                  <button className="text-stone-400"><i className="fa-solid fa-ellipsis"></i></button>
                </div>
                <div className="px-4 pb-3">
                  <p className="text-sm text-stone-700 leading-relaxed">{post.content}</p>
                </div>
                <img src={post.image} className="w-full aspect-video object-cover" />
                <div className="p-4 flex justify-between items-center border-t border-stone-50">
                  <div className="flex gap-6">
                    <button className="text-stone-500 hover:text-emerald-700 flex items-center gap-2 text-xs font-bold transition-colors">
                      <i className="fa-regular fa-heart"></i> {post.likes} Likes
                    </button>
                    <button className="text-stone-500 hover:text-emerald-700 flex items-center gap-2 text-xs font-bold transition-colors">
                      <i className="fa-regular fa-comment"></i> Comments
                    </button>
                  </div>
                  <button className="text-stone-500 hover:text-amber-500 flex items-center gap-2 text-xs font-bold transition-colors">
                    <i className="fa-regular fa-paper-plane"></i> Share
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 text-3xl mb-4">
              <i className="fa-solid fa-calendar-day"></i>
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Upcoming Events</h3>
            <p className="text-sm text-stone-500 max-w-xs">No upcoming invitations for your branch yet. Create one to gather the family!</p>
            <button className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all shadow-md">Create Event</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
