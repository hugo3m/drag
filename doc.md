## Drag and drop

### Create a ray from the camera "through" the mouse

https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#createPickingRay

### Create a plane containing the axis we are working on

NOTE: How to create this plane? One axis is not enough to create a plane

The user needs to choose an axis to drag towards.

In the case of the axis vec(ux), lets define vec(d) the direction of the ray.

Choose either vec(uy) or vec(uz) to be the normal vec(n), such as abs(vec(d).vec(n)) has the highest value.

The highest value means the lowest angle. The lowest angle means that the plane will be as much as possible normal to vec(d). If the plane is normal to vec(d), the user has a large area to drag the axis throughout.

https://doc.babylonjs.com/typedoc/classes/BABYLON.Plane

### Find the intersection between the ray on the plane

Which will morelikely be a point since raycast shouldn't be included into the plane. Could be null as well

https://doc.babylonjs.com/typedoc/classes/BABYLON.Ray

### Project the intersection of the point into the axis


==============================

- add color to the face of the cube
- how to draw plane
- how to make it work on phone
- how to display text and image in the UI
- how to play audio
- how to simulate video with audio playing
- how to simulate click instead of the user