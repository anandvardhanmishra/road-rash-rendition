import * as THREE from 'three';

export class CollisionSystem {
  private tempBox1: THREE.Box3;
  private tempBox2: THREE.Box3;

  constructor() {
    this.tempBox1 = new THREE.Box3();
    this.tempBox2 = new THREE.Box3();
  }

  /**
   * Check if two objects are colliding
   * @param obj1 First object
   * @param obj2 Second object
   * @returns True if objects are colliding
   */
  public checkCollision(obj1: THREE.Object3D, obj2: THREE.Object3D): boolean {
    // Get world AABB for each object
    this.tempBox1.setFromObject(obj1);
    this.tempBox2.setFromObject(obj2);

    // Check if boxes intersect
    return this.tempBox1.intersectsBox(this.tempBox2);
  }

  /**
   * Get collision normal between two objects
   * @param obj1 First object
   * @param obj2 Second object
   * @returns Normalized direction vector from obj1 to obj2
   */
  public getCollisionNormal(obj1: THREE.Object3D, obj2: THREE.Object3D): THREE.Vector3 {
    // Get world AABB for each object
    this.tempBox1.setFromObject(obj1);
    this.tempBox2.setFromObject(obj2);

    // Calculate centers of each box
    const center1 = new THREE.Vector3();
    const center2 = new THREE.Vector3();
    this.tempBox1.getCenter(center1);
    this.tempBox2.getCenter(center2);

    // Calculate direction from center1 to center2
    const normal = new THREE.Vector3();
    normal.subVectors(center2, center1);
    normal.normalize();

    return normal;
  }

  /**
   * Calculate penetration depth between two colliding objects
   * @param obj1 First object
   * @param obj2 Second object
   * @returns Vector representing overlap in each dimension
   */
  public getPenetrationDepth(obj1: THREE.Object3D, obj2: THREE.Object3D): THREE.Vector3 {
    // Get world AABB for each object
    this.tempBox1.setFromObject(obj1);
    this.tempBox2.setFromObject(obj2);

    const min1 = this.tempBox1.min;
    const max1 = this.tempBox1.max;
    const min2 = this.tempBox2.min;
    const max2 = this.tempBox2.max;

    // Calculate overlap in each dimension
    const overlapX = Math.min(max1.x - min2.x, max2.x - min1.x);
    const overlapY = Math.min(max1.y - min2.y, max2.y - min1.y);
    const overlapZ = Math.min(max1.z - min2.z, max2.z - min1.z);

    return new THREE.Vector3(overlapX, overlapY, overlapZ);
  }

  /**
   * Calculate distance between two objects
   * @param obj1 First object
   * @param obj2 Second object
   * @returns Distance between object centers
   */
  public getDistance(obj1: THREE.Object3D, obj2: THREE.Object3D): number {
    // Get world AABB for each object
    this.tempBox1.setFromObject(obj1);
    this.tempBox2.setFromObject(obj2);

    // Calculate centers of each box
    const center1 = new THREE.Vector3();
    const center2 = new THREE.Vector3();
    this.tempBox1.getCenter(center1);
    this.tempBox2.getCenter(center2);

    // Calculate distance
    return center1.distanceTo(center2);
  }

  /**
   * Check if a point is within an object's bounds
   * @param point The point to check
   * @param obj The object
   * @returns True if the point is inside the object
   */
  public isPointInObject(point: THREE.Vector3, obj: THREE.Object3D): boolean {
    // Get world AABB for the object
    this.tempBox1.setFromObject(obj);

    // Check if point is inside
    return this.tempBox1.containsPoint(point);
  }

  /**
   * Perform a ray cast to detect objects in the path
   * @param origin Origin of the ray
   * @param direction Direction of the ray
   * @param maxDistance Maximum distance to check
   * @param objects Array of objects to check against
   * @returns Array of intersections sorted by distance
   */
  public raycast(origin: THREE.Vector3, direction: THREE.Vector3, maxDistance: number, objects: THREE.Object3D[]): THREE.Intersection[] {
    // Create a raycaster
    const raycaster = new THREE.Raycaster(origin, direction.normalize(), 0, maxDistance);

    // Cast ray against objects
    return raycaster.intersectObjects(objects, true);
  }

  /**
   * Broad phase collision detection for performance optimization
   * @param object The object to check
   * @param potentialColliders Array of potential colliders
   * @param gridSize Size of grid cells for spatial partitioning
   * @returns Array of objects that are potentially colliding
   */
  public broadPhaseCheck(object: THREE.Object3D, potentialColliders: THREE.Object3D[], gridSize: number = 10): THREE.Object3D[] {
    // Get world AABB for the object
    this.tempBox1.setFromObject(object);

    // Calculate the grid cell for the object
    const center = new THREE.Vector3();
    this.tempBox1.getCenter(center);

    const cellX = Math.floor(center.x / gridSize);
    const cellZ = Math.floor(center.z / gridSize);

    // Filter potential colliders to those in nearby cells
    return potentialColliders.filter((collider) => {
      // Get world AABB for the collider
      this.tempBox2.setFromObject(collider);

      // Calculate the grid cell for the collider
      const colliderCenter = new THREE.Vector3();
      this.tempBox2.getCenter(colliderCenter);

      const colliderCellX = Math.floor(colliderCenter.x / gridSize);
      const colliderCellZ = Math.floor(colliderCenter.z / gridSize);

      // Check if in the same or adjacent cells
      return Math.abs(cellX - colliderCellX) <= 1 && Math.abs(cellZ - colliderCellZ) <= 1;
    });
  }
}
