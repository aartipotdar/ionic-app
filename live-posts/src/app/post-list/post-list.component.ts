import { Component } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    listOfPosts: Post[] = [
      new Post(
        'Nature',
        'Nature is a British weekly scientific journal founded and based in London, England. As a multidisciplinary publication, Nature features peer-reviewed research from a variety of academic disciplines, mainly in science and technology.',
        'https://static.sadhguru.org/d/46272/1633199491-1633199490440.jpg',
        'rt@gmail.com',
        new Date()
      ),
      new Post(
        'Hampi',
        'Hampi is an ancient village in the south Indian state of Karnataka. It’s dotted with numerous ruined temple complexes from the Vijayanagara Empire. On the south bank of the River Tungabhadra is the 7th-century Hindu Virupaksha Temple, near the revived Hampi Bazaar.',
        'https://www.worldatlas.com/r/w2560-q80/upload/ff/49/57/shutterstock-1509720656.jpg',
        'rt@gmail.com',
        new Date()
      ),
      new Post(
        'Araku Valley',
        `Araku Valley is a hill station and valley region in the southeastern Indian state of Andhra Pradesh. It's surrounded by the thick forests of the Eastern Ghats mountain range. The Tribal Museum is dedicated to the area's numerous indigenous tribes, known for their traditional Dhimsa dance, and showcases traditional handicrafts.`,
        'https://vizagtourism.org.in/images/places-to-visit/header/araku-valley-vizag-tourism-entry-fee-timings-holidays-reviews-header.jpg',
        'rt@gmail.com',
        new Date()
      )
    ];
}
