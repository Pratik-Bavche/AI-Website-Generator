"use client"
import React from 'react';
import PlaygroundHeader from '../_components/PlaygroundHeader';
import ChatSection from '../_components/ChatSection';
import WebsiteDesign from '../_components/WebsiteDesign';
import ElementSettingSection from '../_components/ElementSettingSection';
import { useParams, useSearchParams } from 'next/navigation';

const Playground = () => {
    const {projectId}=useParams();
    const params=useSearchParams()
    const frameId=params.get('frameId')
  return (
    <div>
      <PlaygroundHeader />
      <div className="flex">
        {/* ChatSection */}
        <ChatSection />
        {/* WebsiteDesign */}
        <WebsiteDesign />
        {/* SettingSection */}
        {/* <ElementSettingSection /> */}
      </div>
    </div>
  );
};

export default Playground;
