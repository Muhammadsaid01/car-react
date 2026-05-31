
export default function Advertisement() {
    return <div className="ads-restaurant-frame">
        <video
        className={"ads-video"}
        autoPlay={true}
        loop
        muted
        playsInline
        data-video-media="" 
   >
    <source type="video/mp4" src="video/advertisemt.mp4"/>
   </video>

    </div>

}