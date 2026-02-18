export default function Advertisement() {
	return (
	<div className={"ads-restaurant-frame"}>
		<video
		className={"ads-video"}
		autoPlay={true}
		loop
		muted
		playsInline
		data-video-media=""
		>
		<source src="video/burak-ads.mp4" type="video/mp4" />
		</video>
	</div>
	);
}