import React, { useState, useEffect } from 'react';
import { GMBAgencyProfile, Property } from '../types';
import {
  Search,
  Globe,
  Star,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Phone,
  Code2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Loader2,
  Eye
} from 'lucide-react';

interface GMBSearchPortalProps {
  properties: Property[];
  agencyProfile: GMBAgencyProfile;
  onOpenVirtualTour: (property: Property) => void;
}

export const GMBSearchPortal: React.FC<GMBSearchPortalProps> = ({
  properties,
  agencyProfile,
  onOpenVirtualTour
}) => {
  const [searchQuery, setSearchQuery] = useState('3 bed houses in London with garden');
  const [searchResults, setSearchResults] = useState<Property[]>(properties);
  const [aiSnippet, setAiSnippet] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'gmb-link' | 'google-simulator' | 'seo-landing-page'>('gmb-link');
  const [seoData, setSeoData] = useState<any>(null);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [liveProfile, setLiveProfile] = useState<{
    rating: number | null;
    userRatingsTotal: number | null;
    address: string | null;
    googleMapsUrl: string | null;
  } | null>(null);
  const [liveProfileStatus, setLiveProfileStatus] = useState<'loading' | 'live' | 'unavailable'>('loading');

  useEffect(() => {
    fetch('/api/places/agency-profile')
      .then(r => r.json())
      .then(data => {
        if (data.live && data.profile) {
          setLiveProfile(data.profile);
          setLiveProfileStatus('live');
        } else {
          setLiveProfileStatus('unavailable');
        }
      })
      .catch(() => setLiveProfileStatus('unavailable'));
  }, []);

  const displayRating = liveProfile?.rating ?? agencyProfile.rating;
  const displayReviewCount = liveProfile?.userRatingsTotal ?? agencyProfile.reviewCount;
  const displayAddress = liveProfile?.address ?? agencyProfile.address;

  const executeGoogleSearch = async (queryStr: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/gmb-search?q=${encodeURIComponent(queryStr)}`);
      const data = await res.json();
      setSearchResults(data.properties || []);
      setAiSnippet(data.aiSummary || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    executeGoogleSearch(searchQuery);
  }, []);

  const handleRunSeoGenerator = async () => {
    setIsGeneratingSeo(true);
    try {
      const res = await fetch('/api/ai-gmb-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName: agencyProfile.agencyName,
          city: agencyProfile.branchCity
        })
      });
      const data = await res.json();
      setSeoData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Mode Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">GMB Profile & Google Live Search Integration</h2>
            <p className="text-xs text-slate-400">Google My Business 'View Latest Properties' link & local SEO landing page</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('gmb-link')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === 'gmb-link' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            GMB Profile Card
          </button>

          <button
            onClick={() => setActiveTab('google-simulator')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === 'google-simulator' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Live Search Simulator
          </button>

          <button
            onClick={() => setActiveTab('seo-landing-page')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === 'seo-landing-page' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SEO Landing Page & Schema
          </button>
        </div>
      </div>

      {/* Tab 1: GMB Profile Preview Card */}
      {activeTab === 'gmb-link' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simulated Google Maps / GMB Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>Google Business Profile (GMB)</span>
              </span>
              {liveProfileStatus === 'live' ? (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                  LIVE FROM GOOGLE
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold">
                  DEMO DATA
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{agencyProfile.agencyName}</h3>
              <p className="text-xs text-indigo-300 font-semibold">{agencyProfile.tagline}</p>

              <div className="flex items-center gap-2 text-xs text-amber-400">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold">{displayRating}</span>
                <span className="text-slate-400">({displayReviewCount} Google Reviews)</span>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{displayAddress}</span>
              </p>

              {liveProfileStatus === 'unavailable' && (
                <p className="text-[10px] text-slate-500 pt-1">
                  Set GOOGLE_PLACES_API_KEY in .env to pull this agency's real live Google rating & reviews.
                </p>
              )}
            </div>

            {/* Crucial Requirement Feature: GMB 'View Latest Properties' CTA */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/80 to-slate-950 border border-indigo-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">GMB Link CTA Action</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-mono">
                  g.page/proplens-london
                </span>
              </div>

              <a
                onClick={() => setActiveTab('google-simulator')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Eye className="h-4 w-4" />
                <span>View Latest Properties (Live 360° Portal)</span>
              </a>

              <p className="text-[11px] text-slate-400 text-center">
                Links directly to live availability & instant virtual tour appointments.
              </p>
            </div>
          </div>

          {/* GMB Strategy Highlights */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>GMB Selling Strategy & Direct Lead Conversion</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>1. Direct Local Buyer Acquisition</span>
                </p>
                <p className="text-slate-400">
                  House hunters searching Google Maps for "Estate Agents near Knightsbridge" click the 'View Latest Properties' link directly on your GMB card.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>2. Instant 360° Virtual Tour Hook</span>
                </p>
                <p className="text-slate-400">
                  Buyers view panoramic room renders inside PropLens without leaving their mobile browser, increasing viewing appointment bookings by +48%.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>3. High-Converting SEO Landing Page</span>
                </p>
                <p className="text-slate-400">
                  Every branch gets a custom SEO landing page (`proplens.co.uk/agents/premier-london`) enriched with local school ratings and housing yield data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Google Search Simulator */}
      {activeTab === 'google-simulator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Search Box */}
          <div className="max-w-2xl mx-auto space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
              Google Search Query Simulator
            </label>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-indigo-500/40 shadow-inner">
              <Search className="h-5 w-5 text-indigo-400 ml-2" />
              <input
                type="text"
                placeholder="Search e.g. 'houses in London', '3 bed flats in Manchester'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeGoogleSearch(searchQuery)}
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => executeGoogleSearch(searchQuery)}
                disabled={isSearching}
                className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {isSearching ? 'Searching...' : 'Google Search'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Try: "houses in London with garden", "flats in Manchester", "properties in Bristol"
            </p>
          </div>

          {/* AI Search Overview Snippet */}
          {aiSnippet && (
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-950/60 to-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Sparkles className="h-4 w-4" />
                <span>AI-Generated Search Preview (Powered by Gemini) — not a live Google result</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{aiSnippet}</p>
            </div>
          )}

          {/* Live Properties Grid Output */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Available Properties on PropLens ({searchResults.length} Matches)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map(p => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3">
                  <img
                    src={p.images[0]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">£{p.price.toLocaleString('en-GB')}</p>
                    <p className="text-[11px] text-slate-400">{p.address}, {p.city}</p>
                  </div>

                  <button
                    onClick={() => onOpenVirtualTour(p)}
                    className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View 360° Virtual Tour</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SEO Landing Page & Schema Generator */}
      {activeTab === 'seo-landing-page' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Dedicated SEO Landing Page & JSON-LD Microdata</h3>
              <p className="text-xs text-slate-400">Bespoke Google SEO Landing Page linked from GMB profile</p>
            </div>

            <button
              onClick={handleRunSeoGenerator}
              disabled={isGeneratingSeo}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
            >
              {isGeneratingSeo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate SEO Content with Gemini</span>
            </button>
          </div>

          {/* Landing Page Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                SEO Meta Tags & Area Guide
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold">Meta Title:</label>
                  <p className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono">
                    {seoData?.seoMetaTitle || agencyProfile.seoMetaTitle}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold">Meta Description:</label>
                  <p className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono">
                    {seoData?.seoMetaDescription || agencyProfile.seoMetaDescription}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold">Local Neighborhood Guide:</label>
                  <p className="text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed text-[11px]">
                    {seoData?.localAreaGuide || agencyProfile.neighborhoodHighlights.join('. ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Code2 className="h-4 w-4" />
                <span>JSON-LD Schema.org Microdata</span>
              </h4>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-80">
                <pre>
{seoData?.schemaJsonLd || JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": agencyProfile.agencyName,
  "image": "https://proplens.co.uk/logo.png",
  "@id": agencyProfile.gmbUrl,
  "url": agencyProfile.customDomain,
  "telephone": agencyProfile.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "102 Brompton Road",
    "addressLocality": "London",
    "postalCode": "SW3 1JJ",
    "addressCountry": "UK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.4988,
    "longitude": -0.1627
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": agencyProfile.rating,
    "reviewCount": agencyProfile.reviewCount
  }
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
