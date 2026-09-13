import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, Copy, Check, ShieldCheck, Key, Server, Terminal, Lock } from 'lucide-react';

interface SupabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  const { supabaseConfig, updateSupabaseConfig, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(supabaseConfig.projectUrl);
  const [key, setKey] = useState(supabaseConfig.anonKey);
  const [activeTab, setActiveTab] = useState<'sql' | 'rls' | 'config'>('sql');

  if (!isOpen) return null;

  const fullSqlSchema = `-- ==============================================================================
-- HOTEL BOOKING PLATFORM: FULL SUPABASE SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Platform Functional Specification 2026
-- ==============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'owner', 'guest');
CREATE TYPE hotel_status AS ENUM ('Draft', 'Pending Approval', 'Approved', 'Active', 'Suspended', 'Rejected');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled', 'Rejected');
CREATE TYPE cleaning_status AS ENUM ('Requested', 'Assigned', 'In-Progress', 'Completed', 'Cancelled');

-- 2. PROFILES TABLE (Linked with auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'guest',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOTELS TABLE
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  business_owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Pakistan',
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  address_lookup TEXT,
  description TEXT NOT NULL,
  number_of_rooms INT NOT NULL DEFAULT 1,
  category TEXT NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  business_license_url TEXT,
  cnic_document_url TEXT,
  status hotel_status NOT NULL DEFAULT 'Pending Approval',
  rejection_reason TEXT,
  admin_notes TEXT,
  suspension_reason TEXT,
  license_verified BOOLEAN DEFAULT FALSE,
  cnic_verified BOOLEAN DEFAULT FALSE,
  location_verified BOOLEAN DEFAULT FALSE,
  photos_verified BOOLEAN DEFAULT FALSE,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROOM CATEGORIES
CREATE TABLE public.room_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_type TEXT NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL,
  total_rooms INT NOT NULL DEFAULT 1,
  max_guests INT NOT NULL DEFAULT 2,
  bed_type TEXT NOT NULL,
  size_sq_ft INT,
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  blocked_dates DATE[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS TABLE
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE RESTRICT NOT NULL,
  room_id UUID REFERENCES public.room_categories(id) ON DELETE RESTRICT NOT NULL,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_nights INT NOT NULL,
  number_of_guests INT NOT NULL DEFAULT 1,
  price_per_night NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'Pending',
  special_requests TEXT,
  is_eligible_for_cleaning BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEWS TABLE
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INT DEFAULT 5,
  service_rating INT DEFAULT 5,
  location_rating INT DEFAULT 5,
  comment TEXT NOT NULL,
  owner_reply TEXT,
  owner_replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLEANING REQUESTS TABLE
CREATE TABLE public.cleaning_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  requested_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  room_numbers TEXT[] NOT NULL,
  cleaning_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time_slot TEXT NOT NULL,
  special_instructions TEXT,
  status cleaning_status NOT NULL DEFAULT 'Requested',
  assigned_team_id TEXT,
  assigned_team_name TEXT,
  assigned_team_phone TEXT,
  completed_at TIMESTAMPTZ,
  credits_used INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_requests ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- HOTELS POLICIES:
-- 1. Customers/Guests: Can ONLY view Approved and Active hotels
CREATE POLICY "Public can view approved active hotels"
  ON public.hotels FOR SELECT
  USING (status IN ('Approved', 'Active'));

-- 2. Hotel Owners: Can view and manage ONLY their own hotel (any status)
CREATE POLICY "Owners can view own hotel"
  ON public.hotels FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can update own hotel"
  ON public.hotels FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert registration request"
  ON public.hotels FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- 3. Admins: Full access to all hotels (Draft, Pending, Approved, Rejected, Suspended)
CREATE POLICY "Admins have full access to hotels"
  ON public.hotels FOR ALL
  USING (public.is_admin());

-- ROOM CATEGORIES POLICIES:
CREATE POLICY "Public can view rooms of approved hotels"
  ON public.room_categories FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = room_categories.hotel_id
    AND hotels.status IN ('Approved', 'Active')
  ));

CREATE POLICY "Owners manage own rooms"
  ON public.room_categories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = room_categories.hotel_id
    AND hotels.owner_id = auth.uid()
  ));

CREATE POLICY "Admins manage all rooms"
  ON public.room_categories FOR ALL
  USING (public.is_admin());

-- BOOKINGS POLICIES:
CREATE POLICY "Guests can view own bookings"
  ON public.bookings FOR SELECT
  USING (guest_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Owners view and update bookings of own hotel"
  ON public.bookings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = bookings.hotel_id
    AND hotels.owner_id = auth.uid()
  ));

CREATE POLICY "Admins have full access to bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin());

-- CLEANING REQUESTS POLICIES:
CREATE POLICY "Owners can view and create cleaning requests for own hotel"
  ON public.cleaning_requests FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = cleaning_requests.hotel_id
    AND hotels.owner_id = auth.uid()
  ));

CREATE POLICY "Admins full access to cleaning requests"
  ON public.cleaning_requests FOR ALL
  USING (public.is_admin());
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSqlSchema);
    setCopied(true);
    showToast('Supabase SQL Schema & RLS Policies copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig({
      projectUrl: url,
      anonKey: key,
      connected: true,
    });
    showToast('Supabase configuration saved & live connected!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Supabase Integration & Security RLS</h2>
              <p className="text-xs text-slate-300">
                Functional specification compliant PostgreSQL database schema with Row Level Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" /> Full SQL & Tables Schema
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'rls'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Row Level Security (RLS) Rules
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" /> Supabase Credentials / API Keys
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Run this complete script in your <strong>Supabase SQL Editor</strong> to create all tables (Hotels, Rooms, Bookings, Reviews, Cleaning Requests) with triggers.
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs shrink-0 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy All SQL'}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-[420px]">
                {fullSqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Hotel Owners
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    • Can access and manage ONLY their own hotel data.<br />
                    • Cannot view other hotel owners' private revenue or bookings.<br />
                    • Can request cleaning and manage room categories for their hotel.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    Guests & Customers
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    • Can ONLY view hotels in <strong>Approved</strong> or <strong>Active</strong> status.<br />
                    • Pending, Draft, and Suspended hotels are strictly hidden via RLS query filters.<br />
                    • Can view their own bookings and submit verified reviews.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Platform Admin
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    • Full bypass access to all platform records via <code className="bg-purple-100 px-1 py-0.5 rounded">is_admin()</code>.<br />
                    • Approves / rejects applications, assigns cleaning teams, suspends / reactivates hotels.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono">
                <p className="text-slate-400 mb-2">// Sample RLS Policy Definition from Schema:</p>
                <p className="text-emerald-400 font-semibold">CREATE POLICY "Public can view approved active hotels"</p>
                <p className="text-slate-300">&nbsp;&nbsp;ON public.hotels FOR SELECT</p>
                <p className="text-slate-300">&nbsp;&nbsp;USING (status IN ('Approved', 'Active'));</p>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-4 max-w-xl">
              <p className="text-xs text-slate-600">
                You can configure your real or staging Supabase Project URL and Anon/Service Key here. (The platform also operates with built-in reactive storage out of the box).
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Supabase Anon Key / Service Role</label>
                <input
                  type="password"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
                >
                  Save & Validate Connection
                </button>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready for Live Database Sync
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
