import InvitationExperience from "@/components/InvitationExperience";
import AudioPlayer from "@/components/features/AudioPlayer";
import weddingData from "@/util/data/wedding-data.json";

export async function generateMetadata() {
  const baseUrl = weddingData.websiteUrl.endsWith('/') ? weddingData.websiteUrl.slice(0, -1) : weddingData.websiteUrl;
  const imageUrl = `${baseUrl}/assets/images/social-share.png`;

  return {
    metadataBase: new URL(baseUrl),
    title: `${weddingData.couple.groom.name} & ${weddingData.couple.bride.name} ${weddingData.eventType || 'Wedding'}`,
    description: weddingData.messages.inviteText,
    openGraph: {
      type: 'website',
      url: baseUrl,
      title: `${weddingData.couple.groom.name} & ${weddingData.couple.bride.name} ${weddingData.eventType || 'Wedding'}`,
      description: weddingData.messages.inviteText,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${weddingData.eventType || 'Wedding'} Invitation map snippet`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${weddingData.couple.groom.name} & ${weddingData.couple.bride.name} ${weddingData.eventType || 'Wedding'} Invitation`,
      description: weddingData.messages.inviteText,
      images: [imageUrl],
    }
  };
}

export const viewport = {
  themeColor: '#3D0A14',
};

export default function Home() {
  return (
    <main className="w-full h-full overflow-hidden bg-black relative">
      <InvitationExperience weddingData={weddingData} />
      <AudioPlayer musicUrl="/assets/music/music.mp3" autoplay={true} />
    </main>
  );
}
