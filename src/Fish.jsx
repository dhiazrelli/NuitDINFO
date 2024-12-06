import { useFrame, useLoader, useThree } from "@react-three/fiber";
import FireworksContainer from './Fireworks';
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders/fish/vertex.glsl";
import fragmentShader from "./shaders/fish/fragment.glsl";
import { useControls } from "leva";
import Boid from "./utils/Boid";
import { Html } from "@react-three/drei";

const objPaths = [];
const specialFishAnimation = {
    scale: new THREE.Vector3(1, 1, 1),
    message: "You found me! 🌊",
    animationDuration: 2000,
    dropletPath: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(0, 0.7, 0),
        new THREE.Vector3(0, 0, 0)
    ]
};const texturePaths = [];
for (let i = 1; i <= 15; i++) {
	const number = i.toString().padStart(2, "0");
	objPaths.push(`./TropicalFish_obj/TropicalFish${number}.obj`);
	texturePaths.push(`./TropicalFish_obj/TropicalFish${number}.jpg`);
}

const seaCreaturesFacts = [
	{
		"fact": "Si l'océan était un corps humain, alors ses vagues seraient son souffle, rythmé et incessant.",
		"image": "https://cdn.futura-sciences.com/sources/images/vague.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses marées seraient les battements de son cœur, influencés par la lune.",
		"image": "https://dessindigo.com/storage/images/posts/coeurrealiste/appliquer-couleur-veines-dessin-coeur-humain.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses abysses seraient son esprit, cachant des secrets insondables.",
		"image": "https://images.squarespace-cdn.com/content/v1/5bb9f390da50d330b261fdc8/1615232360552-PUKU1WYM8N0U05BQGJB4/90+copy.jpg?format=750w"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses récifs coralliens seraient ses os, solides et porteurs de vie.",
		"image": "https://img-31.ccm2.net/PWn90VWvixEHtCaW_l0ZSHqlNrs=/910x/smart/88541b2444044b52bbb4f3e1ad4a03d1/ccmcms-hugo/26042812.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses tempêtes seraient ses colères, intenses mais éphémères.",
		"image": "https://media.istockphoto.com/id/1340079356/fr/photo/illustration-du-navire-dans-la-temp%C3%AAte-vagues-gigantesques.jpg?s=612x612&w=0&k=20&c=CKJ-pOtgqvdNvywlt1yG1GgVZgYfRYpzQDwrkUSbsbU="
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses plages seraient sa peau, marquées par le passage du temps.",
		"image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI3CfLUYt3SxUeMMlA-9AE3fOAKSqktJF1Ag&s"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses courants seraient ses veines, transportant l’essentiel à travers lui.",
		"image": "https://www.fedecardio.org/wp-content/uploads/2021/03/schema-veine-systeme_0.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses vagues déferlantes seraient ses rires, éclatants et pleins de vie.",
		"image": "https://www.imagesdoc.com/wp-content/uploads/sites/33/2019/05/AdobeStock_6347082-w.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses tourbillons seraient ses moments de confusion, tourmentés et agités.",
		"image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTXoVFZMKgQu5gIOlafCE2avcT0VNBgFQVA&s"
	},
	{
		"fact": "Si l'océan était un corps humain, alors son eau salée serait ses larmes, témoignant de son histoire.",
		"image": "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/12587/images/dbar4PTiQZWnXeEf97Rl_blog_1280x720-larme_visage.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses fonds marins seraient ses souvenirs, enfouis mais indélébiles.",
		"image": "https://cdn.futura-sciences.com/sources/images/qr/exploration-fonds-marins-ocean-.jpeg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses courants chauds et froids seraient ses humeurs changeantes.",
		"image": "https://fr.oceancampus.eu/files/ressources/_image_upload/CxV.png"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses poissons seraient les idées qui nagent dans son esprit.",
		"image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd4d00zKJLxoe01Oezl2WVMMp8kGS_hboSMQ&s"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses vagues apaisées seraient son repos, calme et régénérateur.",
		"image": "https://www.science-et-vie.com/wp-content/uploads/scienceetvie/2024/07/design-sans-titre-30-1.png"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses algues seraient ses cheveux, flottant et dansant au gré du vent.",
		"image": "https://www.mercilesalgues.com/wp-content/uploads/2021/06/e34b9f8ed4de472d9406278afa189c47_shutterstock_448581862-1024x576.jpg"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses épaves seraient ses cicatrices, souvenirs d’un passé tumultueux.",
		"image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8tzaCIJNEc5HtMnQThHFhYSvAdFTZfyktJg&s"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses eaux calmes seraient sa sérénité, reflet d'une paix intérieure.",
		"image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf4OqYKdFTZLi-0oR_V1Lgv7v1owf_Cq-gEw&s"
	},
	{
		"fact": "Si l'océan était un corps humain, alors ses profondeurs glacées seraient ses peurs, figées mais toujours présentes.",
		"image": "https://www.actu-environnement.com/images/illustrations/breve/41865_large.jpg"
	}
	,
];

export default function Fish() {
	const groupCount = 15;
	const count = 8;
	const groupRef = useRef();
	const [showPopup, setShowPopup] = useState(false);
	const [popupInfo, setPopupInfo] = useState({ fact: "", image: "" });
	const [specialFishType] = useState(Math.floor(Math.random() * groupCount));
	const [showFireworks, setShowFireworks] = useState(false);

	const objs = useLoader(OBJLoader, objPaths);
	const textures = useLoader(THREE.TextureLoader, texturePaths);

	const fish = useRef([]);
	const boids = useMemo(() => {
		const boids = [];
		let boidArr;
		console.log(specialFishType);
		console.log(`                                                                                          
                                                                                          
                                                                                          
                         .......                                                          
                  .:::::.                                                                 
              .--=:.                                                                      
          .:-==-.                                                                         
        .-===-   .=+-                                                                     
        -===.    -##-     .     .:: ::: .::   .:::.      .::::    .::::                   
         ==.     -##-    +#*   :##= ###*##- -##*+*#*-  :*##**#= :*##**##=                 
         .:      -##-     *#+  *#+  ###+   :##=:::*##.-##*.  . :##*.  .*#*                
                 -##-     :##++#+   ###.   -##=======.=##=     -##+    +##      .         
                 -##*++++. =###*    ###.    *#*=--++.  +##+==*: +##+-=*#*:     .-         
                 :=======- -##*.    ===      :====-:    .-====:  .-=++=-      .==-        
                          :##-                                               -===-.       
                           :                                              .:===-.         
                                                                       .:===:.            
                                                                   .::-::.                
                                                             ..::::.                      
                                                          ..                              
                                                                                          
                                                                                          
`);
		for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
			boidArr = [];
			for (let i = 0; i < count; i++) {
				const boid = new Boid();
				boid.position.set(
					(Math.random() - 0.5) * 100 + (groupIndex - 7.5) * 20,
					(Math.random() - 0.5) * 100 + (groupIndex - 7.5) * 20,
					(Math.random() - 0.5) * 100 + (groupIndex - 7.5) * 20
				);
				boid.velocity.set(
					(Math.random() - 0.5) * 2,
					(Math.random() - 0.5) * 2,
					(Math.random() - 0.5) * 2
				);
				boid.setAvoidWalls(true);
				boid.setWorldSize(500, 400, 500);

				boidArr.push(boid);
			}
			boids.push(boidArr);
		}

		return boids;
	}, []);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uSpeed: { value: 3 },
		}),
		[]
	);

	const { neighborhoodRadius, maxSpeed, maxSteerForce } = useControls("Fish", {
		neighborhoodRadius: {
			value: 110,
			min: 0,
			max: 500,
			label: "Neighborhood Radius",
		},
		maxSpeed: { value: 0.3, min: 0, max: 10, label: "Max Speed" },
		maxSteerForce: { value: 0.04, min: 0, max: 1, label: "Max Steer Force" },
	});

	useEffect(() => {
		boids.forEach((groupBoids) => {
			groupBoids.forEach((boid) => {
				boid._neighborhoodRadius = neighborhoodRadius;
				boid._maxSpeed = maxSpeed;
				boid._maxSteerForce = maxSteerForce;
			});
		});
		uniforms.uSpeed.value = maxSpeed * 3;
	}, [neighborhoodRadius, maxSpeed, maxSteerForce]);

	useEffect(() => {
		boids.forEach((group, groupIndex) => {
			group.forEach((boid, i) => {
				const matrix = new THREE.Matrix4();

				const randomScale = (Math.random() - 0.5) * 0.02 + 0.08;

				matrix.compose(
					new THREE.Vector3(boid.position.x, boid.position.y, boid.position.z),
					new THREE.Quaternion(),
					new THREE.Vector3(randomScale, randomScale, randomScale)
				);

				fish.current[groupIndex].setMatrixAt(i, matrix);
			});
		});

		window.addEventListener("mousemove", handleMouseMove, false);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove, false);
		};
	}, []);

	useFrame(({ clock }, delta) => {
		const effectiveDelta = Math.min(0.1, delta) / 0.008;

		boids.forEach((group, groupIndex) => {
			group.forEach((boid, i) => {
				const groupBoids = group;
				const otherBoids = boids.filter((_, i) => i !== groupIndex).flat();

				boid.run(groupBoids, otherBoids, effectiveDelta);

				uniforms.uTime.value = clock.elapsedTime;

				let matrix = new THREE.Matrix4();
				fish.current[groupIndex].getMatrixAt(i, matrix);
				let position = new THREE.Vector3();
				let quaternion = new THREE.Quaternion();
				let scale = new THREE.Vector3();

				matrix.decompose(position, quaternion, scale);

				position.set(boid.position.x, boid.position.y, boid.position.z);

				const target = new THREE.Vector3(
					boid.position.x - boid.velocity.x,
					boid.position.y - boid.velocity.y,
					boid.position.z - boid.velocity.z
				);

				let direction = new THREE.Vector3();
				direction.subVectors(target, boid.position).normalize();

				let matrixx = new THREE.Matrix4();
				matrixx.lookAt(boid.position, target, new THREE.Vector3(0, 1, 0));

				quaternion.setFromRotationMatrix(matrixx);

				matrix.compose(position, quaternion, scale);
				fish.current[groupIndex].setMatrixAt(i, matrix);
			});
			fish.current[groupIndex].instanceMatrix.needsUpdate = true;
		});
	});

	const { camera } = useThree();
	const handleMouseMove = (event) => {
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		let boid;
		let boidsGroup;
		for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
			boidsGroup = boids[groupIndex];
			for (var i = 0; i < boidsGroup.length; i++) {
				boid = boidsGroup[i];

				const planeZ = new THREE.Plane(
					new THREE.Vector3(0, 0, 1),
					-boid.position.z
				);
				const clickPosition = new THREE.Vector3();
				raycaster.ray.intersectPlane(planeZ, clickPosition);

				boid.repulse(clickPosition);
			}
		}
	};

	const handleClick = (event) => {
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		const intersects = [];
		fish.current.forEach((fishMesh, index) => {
			if (fishMesh) {
				const meshIntersects = raycaster.intersectObject(fishMesh);
				if (meshIntersects.length > 0) {
					meshIntersects[0].fishType = index;
				}
				intersects.push(...meshIntersects);
			}
		});

		if (intersects.length > 0) {
			if (intersects[0].fishType === specialFishType) {
				setPopupInfo({
					fact: "VOUS AVEZ TROUVE LE LOGO!!!",
					image: "https://www.nuitdelinfo.com/inscription/uploads/partenaires/434/logos/logo.jpg",
					onClick: () => {
						const specialFish = fish.current[specialFishType];
						if (specialFish) {
							
								setShowFireworks(true);
							  
							const scale = { value: 1 };
							gsap.to(scale, {
								value: 2,
								duration: 1,
								yoyo: true,
								repeat: 1,
								onUpdate: () => {
									specialFish.scale.set(scale.value, scale.value, scale.value);
								},
								onComplete: () => {
									specialFish.scale.set(1, 1, 1);
								}
							});
						}
					}
				});
			} else {
				const randomFact = seaCreaturesFacts[Math.floor(Math.random() * seaCreaturesFacts.length)];
				setPopupInfo(randomFact);
			}
			setShowPopup(true);
		}
	};

	useEffect(() => {
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, []);

	return (
		<>
			<group ref={groupRef}>
				{[...Array(groupCount)].map((_, i) => (
					<instancedMesh
						ref={(el) => (fish.current[i] = el)}
						args={[null, null, count]}
						geometry={objs[i].children[0].geometry}
						key={i}
					>
						<shaderMaterial
							vertexShader={vertexShader}
							fragmentShader={fragmentShader}
							uniforms={{
								...uniforms,
								uShift: { value: i },
								uTexture: { value: textures[i] },
							}}
						/>
					</instancedMesh>
				))}
			</group>
			{showPopup && (
				<Html center>
					<div style={{
						background: 'linear-gradient(135deg, rgba(0, 78, 146, 0.95), rgba(0, 28, 73, 0.95))',
						color: '#ffffff',
						padding: '30px',
						borderRadius: '20px',
						maxWidth: '600px',
						fontSize: '20px',
						position: 'relative',
						textAlign: 'center',
						boxShadow: '0 0 20px rgba(0, 195, 255, 0.3)',
						border: '2px solid rgba(255, 255, 255, 0.1)',
						backdropFilter: 'blur(10px)'
					}}>
						<img 
							src={popupInfo.image} 
							alt="Sea creature"
							
							style={{
								width: '300px',
								height: '225px',
								borderRadius: '15px',
								marginBottom: '20px',
								border: '3px solid rgba(255, 255, 255, 0.2)',
								boxShadow: '0 0 15px rgba(0, 195, 255, 0.2)',
								cursor: popupInfo.fact === "This is special!" ? 'pointer' : 'default',
							}}
						/>
						<p style={{
							margin: '0',
							lineHeight: '1.6',
							textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
							fontFamily: "'Arial', sans-serif"
						}}>{popupInfo.fact}</p>
						<button
							onClick={() => setShowPopup(false)}
							style={{
								position: 'absolute',
								top: '10px',
								right: '10px',
								background: 'rgba(255, 255, 255, 0.1)',
								border: '2px solid rgba(255, 255, 255, 0.2)',
								borderRadius: '50%',
								width: '30px',
								height: '30px',
								color: 'white',
								cursor: 'pointer',
								fontSize: '20px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transition: 'all 0.3s ease',
								':hover': {
									background: 'rgba(255, 255, 255, 0.2)'
								}
							}}
						>
							×
						</button>
					</div>
					<FireworksContainer 
      isActive={showFireworks} 
      onComplete={() => setShowFireworks(false)}
    />
				</Html>
			)}
		</>
	);
}