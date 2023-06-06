---
layout: page
title: Virus transmission
lesson_number: 20
thumbnail: /assets/images/VirusTransmission.png
extract: Visualising airborne infections
equation:
---

Since the Covid-19 pandemic began, airborne viruses have formed a large part of scientific study. In this short Story, we're going to explore one aspect of this work: the effects of airflow.

Suppose that lots of people are sat in a sealed room and one of them is infectious. We'll assume that the infectious person is constantly producing virus-laden particles that spread out around them before slowly decaying away. The simulation below shows what this might look like. The colour corresponds to the concentration or amount of virus in the air.

<!-- virus conc in a still room. Click to simulate a cough -->

<iframe class="sim" src="/sim/?preset=CovidInAStillRoom&story&sf=1" frameborder="0" loading="lazy"></iframe>

With VisualPDE, we're not just limited to watching a simulation: we can interact with it too. Clicking in the room will introduce some viral particles to the air, as if someone with a slight infection had coughed. Try clicking to see what difference a cough can make.

Though each cough introduces some virus to the room, it looks like it quickly decays away until we can't even tell it was there. So, does this mean we shouldn't be worried about a cough?

# Catching the virus
To explore this further, lets look at the probability of getting an infection, which is related but not equal to the virus concentration. Specifically, we'll look at the chance of catching the virus assuming that you'd been stood in the same location for the duration of the simulation. With VisualPDE, we can do this by switching to the Probability View by pressing {{ layout.views }} and choosing 'Probability'. It's worth noting that these numbers aren't meant to match up perfectly with reality, so we'll focus on qualitative features rather than particular values.

Here, the probability of being infected is large close to where we know the source of the infection is, right in the middle of the room. If you clicked in the room to simulate a cough, you should also see some high probabilities elsewhere. This shows that, even though the viral particles seemed to disperse quickly after a cough, they made a significant difference to the probability of catching an infection near to the cougher.

As you might expect, the probability of being infected increases with the amount of time that you're exposed to the virus. This time-dependent effect is especially visible when you click to cough while using the Probability View. To reset the simulation and see this clearly, press {{ layout.erase }}. What do you think will happen if you cough multiple times in the same spot? Test out your prediction with VisualPDE!

# Recirculation
It's fairly rare for air to stay still. Let's see what effect the movement of air can have on the distribution of a virus and the chance of infection. In the simulation below, we've added in the effects of the air being blown from left to right, mimicking an air conditioner, with anything that reaches the right-hand side of the room being recycled back into the left side.

<iframe class="sim" src="/sim/?preset=CovidInARoom&story&sf=1" frameborder="0" loading="lazy"></iframe>

With this new air movement, it now looks like standing downwind of the infected person is a bad idea: particles of the virus are swept from left to right by the air current, and the probability of being infected is much higher on the right of the infected person. Eventually, the recirculation of the air means that viral particles reach even the left side of the room, leading to a large zone in the room where the probability of infection is high. Remember you can swap between Views to see the effects on both Probability and Concentration. Try clicking while viewing the Concentration to really see how the air drives the spread of the virus in one direction, in contrast to the earlier flow-free room.

# A meandering infection
It's also rare for people to stay still. Unsurprisingly, the movement of an infected individual can have a big impact on the spread of a virus. In the next simulation, we've set it up so that the source of the infection moves around the room, as if they were a waiter going between tables in a restaurant. We've also turned off the air conditioner, so that the air in the room is still.

<iframe class="sim" src="/sim/?preset=CovidInAStillRoomCircling&story&sf=1" frameborder="0" loading="lazy"></iframe>

The Probability View shows the buildup of a ring of likely infections as the infectious person circles the room. A quick look at the Concentration View shows their circular path, leaving a trail of virus particles behind them.

In this scenario, what do you think happens if we turn on the air conditioner? The next simulation does just this. Start the simulation by pressing {{ layout.play }}

<iframe class="sim" src="/sim/?preset=CovidInARoomCircling&story&sf=1" frameborder="0" loading="lazy"></iframe>

Now, instead of a nice clean ring of likely infections, we immediately see that people on the downwind side of the room are much more likely to be infected – people that had a lower chance of infection in a room with no air recirculation. If we wait a little longer, we can see this effect increasing and reaching those far upwind of the source of infection, as the recirculating air carries the virus with it, just like it did in our earlier example.

Finally, we can look at the Concentration View to see how the airflow is breaking not only the left–right symmetry of the room, but also the up–down symmetry. What do you think would happen if we reverse the direction that the waiter is circling the room? How would the picture change?

# Epilogue
The story of airborne infections is far from over, but our viral Visual Story has reached its end. Using nothing more than your browser and your curiosity, we've explored how airflow might alter the spread of an airborne virus, witnessed the transient and long-term effects that a simple cough can have, and seen the potentially superspreading effects of a wandering waitor.

As with all of our Stories, it is worth remembering the limitations of what we've learned. Our approach has knowingly ignored lots of factors that could be very important, including the potentially vast differences that can exists between different viruses and between different environments. So, while we've hopefully gained lots of intuition, we would do well to take our conclusions with a healthy pinch of salt.

# Looking for more?
Not quite had enough of exploring airborne infections? You can play around with the speed of the air by opening our [customisable simulation](/sim/?preset=CovidInARoomCircling) and moving the top-most slider that can be found under <span class='click_sequence'>{{ layout.equations }} → **Parameters**</span> and beneath the label beginning with 'V'. Try exploring how the air speed impacts the spread of the virus.

For the science behind this Story, we recommend that you check out the [work](https://doi.org/10.1098/rspa.2021.0383) of Zechariah Lau, [Ian Griffiths](https://people.maths.ox.ac.uk/griffit4/), [Aaron English](https://twitter.com/aaronenglish001), and [Katerina Kaouri](https://profiles.cardiff.ac.uk/staff/kaourik) on modelling the Covid-19 pandemic, which forms a basis for the mathematical models that we've just explored with VisualPDE. We recommend checking out their [Airborne Virus Risk Calculator](https://people.maths.ox.ac.uk/griffit4/Airborne_Transmission/index.html), which inspired this Visual Story.

Enjoyed this Visual Story? We'd love to hear your feedback at [hello@visualpde.com](mailto:hello@visualpde.com).

Looking for more VisualPDE? Try out our other [Visual Stories](/visual-stories) or some mathematically flavoured content from [Basic PDEs](/basic-pdes).


