"use client";

import { Palmtree, Sunset, Waves } from "lucide-react";

const DecorationIcons = () => (
  <>
    <div className="absolute -bottom-6 -right-6 text-[#FFD56C] opacity-30 transform rotate-12">
      <Palmtree size={80} />
    </div>
    <div className="absolute -top-6 -left-6 text-[#FFD56C] opacity-30 transform -rotate-12">
      <Sunset size={80} />
    </div>
    <div className="absolute -bottom-6 -left-6 text-[#5E67FF] opacity-30">
      <Waves size={80} />
    </div>
  </>
);

export default DecorationIcons;
