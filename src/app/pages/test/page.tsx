'use client';

const Test = () => {

  function getScaledDimensions(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      console.log('Image width:', img.naturalWidth);
      console.log('Image height:', img.naturalHeight);
    };

    return [img.naturalWidth, img.naturalHeight];
  }

    return (
      <>
      <img width="50%" className="m-auto" src="https://lettersthroughbytes-images.s3.us-east-2.amazonaws.com/one-funny-dog-isolated-white-background-png.jpg"></img>
      </>
    );
};

export default Test;