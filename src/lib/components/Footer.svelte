<script>
	import Instagram from "./icons/Instagram.svelte";
	import Twitter from "./icons/Twitter.svelte";
	import Youtube from "./icons/Youtube.svelte";
</script>

<footer class="bg-grayLight py-20 px-4 flex justify-center text-center md:text-left items-center">
	<div class="container flex flex-col md:flex-row  md:items-start items-center md:justify-between gap-8 md:gap-4">
		<div class="flex flex-col items-center md:items-start gap-2">
			<div class="flex gap-4">
				<a href="#" aria-label="Sonobay youtube"><Youtube></Youtube></a>
				<a href="#" aria-label="Sonobay Twitter"><Twitter></Twitter></a>
				<a href="#" aria-label="Sonobay Instagram"><Instagram></Instagram></a>
				
			</div>
			<img src="/images/LogoGray.png" class="w-52" alt="Sonobay logo">
			<p>2022 Sono Bay Inc., All Rights Reserved.</p>
		</div>
		
		<div class="flex gap-16">
			<div class="flex flex-col gap-2">
				<a href="/devices">MARKET</a>
				<a href="/devices">MINT</a>
				<a href="#">LIST</a>
				<a href="#">LEADERS</a>
			</div>
			<div class="flex flex-col gap-2">
				<a href="#">ABOUT</a>
				<a href="#">HOW TO</a>
				<a href="#">WALLET</a>
				<a href="#">MY PAGE</a>
			</div>
			
		</div>
	</div>
	
	
</footer>