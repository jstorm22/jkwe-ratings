export function PodcastTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Listen to our podcast</h2>

      <div className="bg-[#1a1a1a] rounded-xl p-8 mb-8">
        <iframe
          src="https://embed.podcasts.apple.com/us/podcast/jonathan-karl-watch-everything-movies-and-television/id1658101657"
          height="450"
          frameBorder="0"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="autoplay *; encrypted-media *; clipboard-write"
          className="w-full rounded-lg"
        ></iframe>
      </div>

      <div className="prose prose-invert max-w-none">
        <h3 className="text-xl font-bold text-orange-400 mb-3">About the Show</h3>
        <p className="text-gray-300 leading-relaxed">
          We're Jonathan and Karl, and we're trying to watch everything. Every episode,
          we watch a new movie or TV show and give our honest thoughts and ratings.
          From classics to new releases, from blockbusters to hidden gems, we cover it all.
        </p>
        <p className="text-gray-300 leading-relaxed mt-4">
          Check out our individual rankings in the Ranked Compare tab to see how our
          tastes differ, or browse the Movies tab to find your next watch!
        </p>
      </div>
    </div>
  );
}
