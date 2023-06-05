<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->


<!-- PROJECT LOGO 
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
-->
<h1>Mobile Playlist App</h1>

<!--   <p align="center">
    project_description
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p> -->
</div>



<!-- TABLE OF CONTENTS -->

<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details> -->



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

A simple mobile app to play music.
<br><br>
I created this app with the intention of building a personal app that I would enjoy using daily, 
while also gaining knowledge about React/React Native and mobile app development. Initially, my aim was to develop a 
simple music player app capable of playing local music files and creating custom playlists. However, the
process of transferring music files from my computer to the app using a cable proved to be tedious. 
Thus I created and integrated my lightweight Django backend ([link here](https://github.com/Alandorn-p/music_backend.git)), which allowed me to incorporate the ability to search and download audio directly from YouTube, eliminating the need to connect my phone to the computer.


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- GETTING STARTED -->
## Getting Started

### Installation
For local development:
1. Clone the repo
   ```sh
   git clone https://github.com/Alandorn-p/mobile-music-player.git
   ```
2. Install dependencies (TODO)
   ```sh
   npm install
   ```
3. Start the server using the command below. This should output a QR code.
   ```sh
   npm start
   ```
4. Open the Expo Go app and scan the QR code

5. (Optionally) If you want to also download from youtube,  ([start the backend server](https://github.com/Alandorn-p/music_backend.git))
   


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Screenshots

<!-- ![My Image](images/audiolist.jpg)

![My Image](images/player.jpg)

![My Image](images/download.jpg)

![My Image](images/download_finish.jpg)
 -->
<!-- 
<table>
  <tr>
    <td> <img src="images/audiolist.jpg"  ></td>
    <td><img src="images/player.jpg" align="right" ></td>
  </tr>
  <tr>
    <td> <img src="images/download.jpg"  ></td>
    <td><img src="images/download_finish.jpg" ></td>
  </tr>
</table> -->


<div style="width: 50%; display: flex; justify-content: center;">
<table cellspacing="0" cellpadding="0" border="0" >
    <tr>
        <td style="text-align: center;">
            <img src="images/audiolist.jpg" alt="" />
        </td>
        <td style="text-align: center;">
            <img src="images/player.jpg" alt="" />
        </td>
        <td style="text-align: center;">
            <img src="images/download.jpg" alt="" />
        </td>
        <td style="text-align: center;">
            <img src="images/download_finish.jpg" alt="" />
        </td>
    </tr>
</table>
</div>






<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Create config tab
- [ ] Finish Player and PlayList tab
- [ ] Add custom playlist functionality
- [ ] Configure Expo project to the new build system (EAS)



<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Al Palanuwech -  ap689@cornell.edu

Github Link: [Alandorn-p](https://github.com/Alandorn-p)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments
A base functionality of this app follows the tutorial made by a Youtuber Full Stack Niraj. [Link](https://www.youtube.com/watch?v=zVUWdppGom8&list=PLaAoUJDWH9Wqatfwa4SEfyFevrl8QefcN&index=1&ab_channel=FullStackNiraj) to the tutorial playlist.

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
