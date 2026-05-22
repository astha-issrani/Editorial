import { useEffect } from 'react';

export default function AdUnit({ slot, format = 'auto' }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}