import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";

export default function TylerInFrontOfBrickWallSmilingImage() {
  return (
    <CloudinaryImage
      publicId="front_of_brick_wall_smiling"
      directory="profile"
      width={400}
      height={400}
      alt="Picture of Tyler Earls standing in front of a brick wall and smiling"
      transformation={"ar_1:1,c_thumb,g_xy_center,r_max,w_800,x_730,y_800"}
      loading="eager"
      fetchPriority="high"
    />
  );
}
