'use client';

import Image from 'next/image'

const Valentine = () => {

    const data = [
        ["i. Impossible Germany — Wilco", "https://m.media-amazon.com/images/I/816PorW737L._UF1000,1000_QL80_.jpg", "There's a certain intimacy to routines. I often imagine us truly living together, past the honeymoon phase, past the novelty of finally moving in together. I mean the routine of waking up, leaving for work, making dinner and casually talking about our weekend plans. Most days we probably won't actively recognize how perfect our life is. Not that we'll take it for granted, it's just we'll get so used to it. What a joy it would be, to get used to a life together. Where every yesterday is another tomorrow. This song makes me think of that future, capturing the simplicity and harmony of the two of us living with and breathing in each other every day."],
        ["ii. Purple Rain — Prince", "https://upload.wikimedia.org/wikipedia/en/9/9c/Princepurplerain.jpg", "If someone ever asks me what song I'd play on our first night in our apartment together, I wouldn't hesitate to say Purple Rain. It's always been one of my favorite songs, and brings me a certain romantic and youthful energy whenever I hear it. Iss that just what all 80s music is like?? Maybe, but this one knocks it out of the park in terms of slickness and confidence. Prince knew he'd rule the world with Purple Rain."],
        ["iii. I Can't Win — The Strokes", "https://upload.wikimedia.org/wikipedia/en/9/9f/Room_on_Fire_cover.jpg", "The Strokes always capture the rawness and liberty of 2000s alternative rock. Their music gives me a lot of comfort, because it feels accessible but also historical. It makes me feel like good things are meant to persist. You're my good thing, and you will persist. I also just thought you'd like this song too. I'm not sure."],
        ["iv. Good Days — SZA", "https://upload.wikimedia.org/wikipedia/en/7/7c/SZA_-_Good_Days.png", `Yeah it's popular, yeah it's not "underground" or "indie," and yeah it easily tops my list. Something about the melody feels so refreshing and hopeful, something I've genuinely always associated with you. I actually remember in senior year of high school listening to this and thinking about how you were quite literally always on my mind. Yeah, probably not exactly "Good Days" back then, but all things considered it did promise me I'd feel what I feel today. You're my peace and comfort.`],
        ["v. Twist and Shout — Beatles", "https://upload.wikimedia.org/wikipedia/en/6/61/BeatlesTwistanShoutSingle.jpg", "I remember playing this in my car over winter break and you saying you loved this song. Nothing could be more fitting then this being one of our songs. All of our private laughs, inside jokes, and hidden smiles carry a mischiveous, playful joy that I think emanates from this song. I can't help but smile hearing this song and picturing our adventures together, punctuated by bursts of laughter and silly jokes."],
        ["vi. Sagu Palm's Song (Live at Milton Court) — Ichiko Aoba", "https://f4.bcbits.com/img/a3348933824_5.jpg", "It's hard to tell which is more effortless: the violinists painting the air with crystalline tones and unwavering hums or Aoba's melodies gently floating atop them. If there is such a thing as inborn talent, Aoba was surely bestowed with an undeniable gift and destined to soothe millions. It's been easy welcoming Aoba's work into my life. It searched me, found a comfortable corner, and settled as a warm reminder of beauty. Exactly as you did, my warm reminder of beauty."],
        ["vii. Free In The Knowledge — The Smile", "https://upload.wikimedia.org/wikipedia/en/5/50/A_Light_for_Attracting_Attention_%28The_Smile_album_-_cover_art%29.png", "Whatever Radiohead has accomplished in the past three decades, The Smile has perfected. The Smile is unbounded by the weight of a household name, more free to flesh out ideas that may not have stuck on albums like A Moon Shaped Pool or In Rainbows. This song has always felt comforting and kind, more so than Radiohead's often grief-stricken choruses. There's a particular lushness to this song that you feel safe settling into. I'm free knowing that one day long distance will end. I can't wait to hear this on a turntable in our own house and let its kindness adorn every wall and ceiling."],
        ["viii. Lover, You Should've Come Over — Jeff Buckley", "https://upload.wikimedia.org/wikipedia/en/e/e4/Jeff_Buckley_grace.jpg", `This list wouldn't be complete without what is arguably "our song." Every chord is yearning, every lyric is passionate, and every moment is equally moving. Nothing encapsulates our romance more than the longing of this song. I so often dream of a time you can just come over whenever. I want to be comforted by your soft skin and gentle hands, forever, forever. <i>She's the tear that hangs inside my soul forever.</i>`]
    ]

    return (
      <>
        <div className="w-[80%] lg:w-[50%] m-auto my-10">
            <h1>For my beautiful girl, Adrienne.</h1>

            <p className="mt-10">A long time ago, I&apos;d started compiling a list of the most beautiful songs I&apos;d ever heard. Most of them came naturally to me, but I struggled to put into words exactly <i>why</i> I found them so beautiful. My prose often felt contrived—poetic for the sake of poetry—and devoid of depth. And then, almost magically so, when you returned to my arms, I was bequeathed with a striking standard of beauty, and the capability to express fascination properly. Experiencing you has given me a stronger vocabulary to define all things lovely and sweet; I have a better understanding of what is beautiful & meaningful to me.</p>

            <p className="mt-10">You&apos;re aware that I think a lot, and deeply, about music. My grandest step forward lately has been realizing my passion for music and you are one and the same. I&apos;m a simple man with a complex taste—but I know beautiful when I [see, hear] it. So here&apos;s a list of songs I find truly beautiful, songs I feel you in, songs that I hope will decorate our future together, forever.</p>

            {data.map((value, index) => (
                <div className="mt-10" key={index}>
                    <p className="text-right">
                        <i>{value[0]}</i>
                    </p>
                    <div className="flex flex-col lg:flex-row justify-between items-center mt-4">
                        <div className="relative my-4 lg:my-0 w-[125px] h-[125px] flex-shrink-0">
                            <Image
                            src={value[1]}
                            alt="Impossible Germany"
                            fill
                            className="object-cover"
                            />
                        </div>
                        <div className="flex-1 ml-5">
                            <p>
                            {value[2]}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            <p className="mt-10">Happy Valentine&apos;s Day!!!!!! {`:)))))) <3`}. My lovely lovely girl you make me soooooo happy sorry if this is too corny or awk but i reeeeeeeeally love you!!!!</p>
            <p className="mt-10">Sid.</p>
        </div>
      </>
    );
};

export default Valentine;