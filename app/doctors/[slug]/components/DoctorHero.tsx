'use client';

import { useState } from 'react';
import { CLINIC } from '@/lib/data';

type DoctorHeroProps = {
  name: string;
  role: string;
  photoFilename: string | null;
  avatarInitials: string;
  avatarColor: string;
  doctorType: string;
  branches: string[];
  lastActiveAt: string | null;
  patientsCount: number;
};

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DoctorHero({
  name,
  role,
  photoFilename,
  avatarInitials,
  avatarColor,
  doctorType,
  branches,
  lastActiveAt,
  patientsCount,
}: DoctorHeroProps) {
  const [copied, setCopied] = useState(false);
  const days = daysSince(lastActiveAt);
  const showActivity = doctorType === 'obstetrician' && days !== null && days < 14;

  const handleCall = () => {
    window.location.href = `tel:${CLINIC.phone}`;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: do nothing */
    }
  };

  return (
    <section style={{
      background: 'linear-gradient(160deg, #05121e 0%, #0a1f30 60%, #0d2840 100%)',
      color: '#fff',
      padding: '64px 48px 56px',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Back breadcrumb */}
        <a
          href="/#doctors"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(255,255,255,.4)', textDecoration: 'none',
            marginBottom: 36, letterSpacing: '.3px',
            transition: 'color .15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Команда лікарів
        </a>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Photo / Avatar */}
          <div style={{ flexShrink: 0 }}>
            {photoFilename ? (
              <div style={{
                width: 128, height: 128, borderRadius: 24,
                overflow: 'hidden', border: '2px solid rgba(255,255,255,.15)',
              }}>
                {(() => {
                  const base = photoFilename.replace(/\.[^.]+$/, '');
                  return (
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={`/images/doctors/${base}-400w.webp 400w, /images/doctors/${base}-200w.webp 200w, /images/doctors/${base}-100w.webp 100w`}
                        sizes="128px"
                      />
                      <img
                        src={`/images/doctors/${photoFilename}`}
                        alt={name}
                        width={128}
                        height={128}
                        loading="eager"
                        decoding="async"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </picture>
                  );
                })()}
              </div>
            ) : (
              <div style={{
                width: 128, height: 128, borderRadius: 24,
                background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 800, color: '#fff',
                border: '2px solid rgba(255,255,255,.15)',
              }}>
                {avatarInitials}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {/* Role eyebrow */}
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--tl)',
              marginBottom: 10,
            }}>
              {role}
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font)',
              fontSize: 38, fontWeight: 600, lineHeight: 1.15,
              color: '#fff', marginBottom: 16, letterSpacing: '-.3px',
            }}>
              {name}
            </h1>

            {/* Activity line — only obstetricians, recent */}
            {showActivity && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: 'rgba(255,255,255,.45)',
                marginBottom: 16,
              }}>
                <span style={{ color: '#4ade80', fontSize: 8 }}>●</span>
                Веде прийом
                {days !== null && days === 0 && ' · Оновила дані сьогодні'}
                {days !== null && days === 1 && ' · Оновила дані вчора'}
                {days !== null && days > 1 && ` · Оновила дані ${days} дн. тому`}
                {patientsCount > 0 && ` · ${patientsCount} пацієнток`}
              </div>
            )}

            {/* Branches */}
            {branches.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                {branches.map((b) => (
                  <span key={b} style={{
                    background: 'rgba(255,255,255,.08)',
                    border: '1px solid rgba(255,255,255,.14)',
                    borderRadius: 9999, padding: '4px 12px',
                    fontSize: 12, color: 'rgba(255,255,255,.65)',
                  }}>
                    📍 {b}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleCall}
                style={{
                  background: 'var(--c)', color: '#fff', border: 'none',
                  padding: '13px 28px', borderRadius: 9999,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Записатись
              </button>
              <button
                onClick={handleShare}
                style={{
                  background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)',
                  border: '1px solid rgba(255,255,255,.15)',
                  padding: '13px 20px', borderRadius: 9999,
                  fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {copied ? '✓ Скопійовано' : 'Поділитись'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          section[style*="64px 48px"]{padding:40px 20px 36px!important}
          h1{font-size:28px!important}
        }
      `}</style>
    </section>
  );
}
