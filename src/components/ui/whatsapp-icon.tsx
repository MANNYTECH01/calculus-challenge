import React from 'react';
import { Button } from '@/components/ui/button';

const WhatsAppIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const WhatsAppButton: React.FC = () => {
  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/your-group-invite-link"; // <-- IMPORTANT: Replace with your actual WhatsApp link

  return (
    <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" className="flex items-center gap-2">
        <WhatsAppIcon />
        <span>Join Group</span>
      </Button>
    </a>
  );
};

export default WhatsAppButton;