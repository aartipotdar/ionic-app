import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, of, switchMap, take, tap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';
import { Place } from './place.model';

/** Way pf adding array of data */
// {
//   id: 'p1',
//   title: 'Agra',
//   description:
//     'If there was just one symbol to represent all of India, it would be the Taj Mahal.',
//   imageUrl:
//     'https://www.planetware.com/wpimages/2019/11/india-best-places-to-visit-agra.jpg',
//   price: 2000,
//   availableFrom: new Date('2020-01-01'),
//   availableTo: new Date('2023-12-31'),
//   userId: 'abc',
// },
// {
//   id: 'p2',
//   title: 'Mumbai',
//   description:
//     'Head to the energetic, coastal city of Mumbai–home to ultra-wealthy entrepreneurs and the hottest Bollywood actors.',
//   imageUrl:
//     'https://www.planetware.com/wpimages/2019/11/india-best-places-to-visit-mumbai.jpg',
//   price: 4000,
//   availableFrom: new Date('2020-01-01'),
//   availableTo: new Date('2023-12-31'),
//   userId: 'abc',
// },
// {
//   id: 'p3',
//   title: 'Rajasthan',
//   description:
//     '"Land of Kings," Rajasthan brims with remnants of the kings and queens of past centuries. Between its glittering palaces, stately forts, and lively festivals, this western state deserves a starring role in your trip to India.',
//   imageUrl:
//     'https://www.planetware.com/wpimages/2019/11/india-best-places-to-visit-rajasthan.jpg',
//   price: 6000,
//   availableFrom: new Date('2020-01-01'),
//   availableTo: new Date('2023-12-31'),
//   userId: 'abc',
// },

/**  another way to add array of data which was giving errors **/
// new Place(
//   'p1',
//   'Agra',
//   'If there was just one symbol to represent all of India, it would be the Taj Mahal.',
//   'https://www.planetware.com/wpimages/2019/11/india-best-places-to-visit-agra.jpg',
//   2000
// ),

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: PlaceData }>(
          `https://ionic-angular-course-e0b04-default-rtdb.firebaseio.com/offered-places.json?auth=${token}`
        );
      }),
      map((resData) => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return places;
        // return [];
      }),
      tap((places) => {
        this._places.next(places);
      })
    );
  }

  // getPlace(id: string) {
  //   return this.places.pipe(
  //     take(1),
  //     map((places) => {
  //       return { ...places.find((p) => p.id === id) };
  //     })
  //   );
  // }

  //fetch from backend
  getPlace(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<PlaceData>(
          `https://ionic-angular-course-e0b04-default-rtdb.firebaseio.com/offered-places/${id}.json?auth=${token}`
        );
      }),
      map((placeData) => {
        return new Place(
          id,
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        );
      })
    );
  }

  //cloud functions won't work if billing not enabled
  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<{ imageUrl: string; imagePath: string }>(
          'cloud function generated url',
          uploadData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No user found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          dateFrom,
          dateTo,
          fetchedUserId,
          location
        );
        return this.http.post<{ name: string }>(
          `https://ionic-angular-course-e0b04-default-rtdb.firebaseio.com/offered-places.json?auth=${token}`,
          { ...newPlace, id: null }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000), //delay in milliseconds
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    let fetchedToken: string;
    return this.authService.token.pipe(take(1), switchMap(token => {
      fetchedToken = token;
      return this.places;
    }),
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://ionic-angular-course-e0b04-default-rtdb.firebaseio.com/offered-places/${placeId}.json?auth=${fetchedToken}`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
