import React from 'react';
import { Button } from '@/components/ui/button';

const WhatsAppIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#25D366]"
  >
    <path
      d="M19.67,15.65a2.5,2.5,0,0,1-1.35.81c-.52.16-1.12.22-1.66.1-1.28-.29-2.47-1-3.55-1.93s-2-2-2.83-3.23a8.1,8.1,0,0,1-1-3.28c0-.52.09-1,.22-1.44a2.29,2.29,0,0,1,.81-1.28,1,1,0,0,1,.73-.32h.35a.82.82,0,0,1,.71.48l.9,1.87a.87.87,0,0,1,0,.8.71.71,0,0,1-.38.56l-.83.67a.38.38,0,0,0-.14.33,4.4,4.4,0,0,0,1.15,2.2,4.4,4.4,0,0,0,2.2,1.15.38.38,0,0,0,.33-.14l.67-.83a.71.71,0,0,1,.56-.38.87.87,0,0,1,.8,0l1.87.9a.82.82,0,0,1,.48.71v.35A1,1,0,0,1,19.67,15.65ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z"
    />
  </svg>
);

const WhatsAppButton: React.FC = () => {
  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/L3buyLeEsGXF8YNhKlFC65"; 

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