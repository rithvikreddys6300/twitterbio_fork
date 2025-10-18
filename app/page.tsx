"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import PlatformDropDown, { PlatformType } from "../components/PlatformDropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Toggle from "../components/Toggle";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [platform, setPlatform] = useState<PlatformType>("Twitter/X");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [isLlama, setIsLlama] = useState(false);

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `${
    vibe === "Casual" ? "relaxed" : vibe === "Funny" ? "silly" : "professional"
  } ${platform.toLowerCase()} biographies with no hashtags. ${
    vibe === "Funny" ? "Make the biographies humorous" : ""
  } Use this context: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    
    try {
      const response = await fetch("/api/together", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          platform,
          model: isLlama
            ? "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
            : "mistralai/Mixtral-8x7B-Instruct-v0.1",
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const runner = ChatCompletionStream.fromReadableStream(response.body!);
      runner.on("content", (delta) => setGeneratedBios((prev) => prev + delta));

      scrollToBios();
    } catch (error) {
      console.error("Error generating bio:", error);
      toast.error("Failed to generate bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen px-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center mt-12 sm:mt-20">
        {/* Stats Badge */}
        <div 
          className="glass-effect rounded-2xl py-2 px-6 text-sm mb-8 hover-scale 
                     transition-all duration-300 shadow-custom"
          style={{ 
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>200,000+</span> social media bios generated so far
        </div>

        {/* Main Title */}
        <h1 
          className="sm:text-6xl text-4xl max-w-4xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Generate your perfect{" "}
          <span className="gradient-text">social media bio</span>{" "}
          using AI
        </h1>
        
        <p 
          className="text-xl sm:text-2xl max-w-2xl mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          Create engaging bios for any platform in seconds with the power of AI
        </p>

        {/* Model Toggle */}
        <div className="mb-12">
          <Toggle isGPT={isLlama} setIsGPT={setIsLlama} />
        </div>

        {/* Main Form */}
        <div className="max-w-2xl w-full">
          {/* Step 1 */}
          <div className="flex mt-10 items-center space-x-4 mb-6">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full 
                         font-bold text-white shadow-custom"
              style={{ background: 'var(--gradient-primary)' }}
            >
              1
            </div>
            <p 
              className="text-left font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Choose your platform
            </p>
          </div>
          
          <div className="mb-10">
            <PlatformDropDown platform={platform} setPlatform={(newPlatform) => setPlatform(newPlatform)} />
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-4 mb-6">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full 
                         font-bold text-white shadow-custom"
              style={{ background: 'var(--gradient-primary)' }}
            >
              2
            </div>
            <p 
              className="text-left font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Describe yourself{" "}
              <span style={{ color: 'var(--text-secondary)' }}>(job, hobby, interests)</span>
            </p>
          </div>
          
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-xl p-4 text-lg shadow-custom 
                       transition-all duration-300 focus:shadow-custom-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '2px solid'
            }}
            placeholder="e.g. Software engineer who loves hiking and coffee"
          />
          
          {/* Step 3 */}
          <div className="flex mb-6 mt-10 items-center space-x-4">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full 
                         font-bold text-white shadow-custom"
              style={{ background: 'var(--gradient-primary)' }}
            >
              3
            </div>
            <p 
              className="text-left font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Select your vibe
            </p>
          </div>
          
          <div className="mb-10">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          
          {/* Generate Button */}
          {loading ? (
            <button
              className="w-full rounded-xl font-medium px-8 py-4 text-lg 
                         shadow-custom transition-all duration-300"
              style={{
                background: 'var(--gradient-primary)',
                color: 'white'
              }}
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          ) : (
            <button
              className="w-full rounded-xl font-medium px-8 py-4 text-lg 
                         shadow-custom hover-scale hover:shadow-custom-lg
                         transition-all duration-300"
              style={{
                background: 'var(--gradient-primary)',
                color: 'white'
              }}
              onClick={(e) => generateBio(e)}
            >
              Generate your {platform} bio ✨
            </button>
          )}
        </div>
        
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        
        {/* Divider */}
        <div 
          className="w-full max-w-2xl h-px my-16"
          style={{ backgroundColor: 'var(--border-primary)' }}
        />
        
        {/* Generated Results */}
        <div className="space-y-10 my-10 w-full max-w-4xl">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold mx-auto mb-8"
                  style={{ color: 'var(--text-primary)' }}
                  ref={bioRef}
                >
                  Your generated {platform} bios
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-1 max-w-3xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio, index) => {
                    return (
                      <div
                        className="glass-effect rounded-2xl p-6 hover-scale 
                                   transition-all duration-300 cursor-copy
                                   shadow-custom hover:shadow-custom-lg"
                        style={{
                          border: '1px solid var(--border-primary)'
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio.trim());
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={index}
                      >
                        <p 
                          className="text-lg leading-relaxed"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {generatedBio.trim()}
                        </p>
                        <p 
                          className="text-sm mt-2 opacity-70"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {generatedBio.trim().length} characters
                        </p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
