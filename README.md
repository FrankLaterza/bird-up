# bird-up
## Inspiration
Pokémon GO and Snap add fun to the classic Pokémon format by increasing the novelty of simple observation through game-ification tactics. Simply finding and catching (through both photography and collection) these unique creatures in interesting ways drives the appeal and quality of those experiences. Given the continual advancement of Machine Learning for Object Classification and Image Segmentation it seemed fitting to apply the game-ification tactics of Pokémon GO and Snap onto bird watching. 

## What it does
Bird Box allows users to see local birds in their area and attempt to take the best quality photos of our 200 total available bird species. Machine Learning is leveraged to both classify the appropriate bird species of our taken bird picture but also segment its area in the image to judge the quality of our picture based on the bird's positioning. Taking pictures of new birds adds them to your "BirdDex", and all images taken are added to your photo 

## How we built it
We ran a React Frontend using JS and CSS with a focus on a mobile view first, a Flask Backend using Python, and a local db instance using MySQLLite. Our frontend utilized three major external API's: Wikipedia to fetch descriptions of our bird species, Google Maps to create our map view, and EBird to fetch local data on bird sightings. Our backend relied on a Classification and Image Segmentation model built for our needs to classify our bird species and segment their area for further rating calculations. We created these models by finetuning off of YOLOv8 checkpoints and applying further work with data augmentation, parameter modifications, and further optimizations to combat overfitting. Our rating system from there was simple mathematics to see how well our image followed the rule of thirds, if the subject clipped out of the image or not, and the visual quality of the image. 

## Challenges we ran into
There are many firsts for us during this project. sqlLite was recommended by one of the advisors and was an ease when sharing data between us due to its file based structure. Although most of the project went surprisingly well. All of our members has useful experiences that made our chemistry balance well. The biggest challenge was training out own machine learning model to correctly classify birds.  Given a limited dataset that caused overfitting we had to adapt our dataflow pipeline to handle this issue as we continued to build up our model.

## Accomplishments that we're proud of
The team is _incredibly_ proud of our UI/UX and ML model. Dynamically generating custom map pins and bird frequency zones was a huge learning curve that we overcame, we poured hours into extensively re-training an existing ML model, and we're happy to say that the project's UI/UX and aesthetics never fail to make us smile. Also, the team as a whole feels great about the teamwork this hackathon. For the majority of us, this is the smoothest a project has ever progressed, and we feel like we delegated tasks and balanced responsibilities really really well. 

## What we learned
We learned that working hard can be fun. The members on our team love to game. Making this project. The ability to will our ideas into existence empowers us to work hard and create something accessible and fun for everyone.

## What's next for Bird Box
If work on Bird Box continues, we're really excited to add some features to improve the user experience on the map. Specifically, it'd be great to implement a sort of nearby system, to let users know more succinctly which birds have been spotted in their area. Also, we think an AI-powered bird-health assessment tool would be an excellent improvement to our project. We would love for our project to help educate our users about their local ecosystem, and list some actions they can take to better protect it.